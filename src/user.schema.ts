import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const userSchema = z.object({
    id: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    email: z.string().email().openapi({ example: "alice@example.com" }),
    name: z.string().min(1).openapi({ example: "Alice" }),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.omit({ id: true }).openapi("CreateUser");

export type CreateUser = z.infer<typeof createUserSchema>;
