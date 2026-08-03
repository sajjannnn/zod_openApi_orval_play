import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createUserSchema, userSchema } from "./user.schema";


 export const registry = new OpenAPIRegistry();

 registry.register("User", userSchema);

 registry.register("CreateUser", createUserSchema);

 registry.registerPath({
    method: "get",
    path: "/users/{id}",
    summary: "Get a user by id",
    tags: ["users"],
    parameters: [
        {name: "id", in: "path", required: true, schema:{type: "string", format: "uuid"}},
    ],
    responses: {
        200: {
            description: "OK",
            content: { "application/json": {schema: {$ref: "#/components/schemas/User"}}},
        },
    },
 });

 registry.registerPath({
    method: "post",
    path: "/users",
    summary: "Create a user",
    tags: ["users"],
    request: {
        body: {
            content: { "application/json": { schema: {$ref: "#/components/schemas/CreateUser"} } },
        },
    },
    responses: {
        201: {
            description: "Created",
            content: { "application/json": {schema: {$ref: "#/components/schemas/User"}}},
        },
    },
 });

 export function generateOpenApiDocument(){
    const generator = new OpenApiGeneratorV3(registry.definitions);
    return generator.generateDocument({
        openapi: "3.0.0",
        info: {title: "zod-openapi-play", version: "1.0.0"}
    });
 }