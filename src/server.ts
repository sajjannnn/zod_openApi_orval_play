import express from "express";
import { generateOpenApiDocument } from "./openapi";
import { createUserSchema, User } from "./user.schema";

const app = express();

app.use(express.json());

app.get("/openapi.json", (_req, res) => {
    res.json(generateOpenApiDocument());
})

const users = new Map<string, User>([
     [
    "123e4567-e89b-12d3-a456-426614174000",
    { id: "123e4567-e89b-12d3-a456-426614174000", email: "alice@example.com", name: "Alice" },
  ],
])



app.get("/users/:id", (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.post("/users", (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const user: User = { ...parsed.data, id: crypto.randomUUID() };
  users.set(user.id, user);
  res.status(201).json(user);
});

app.listen(4000, () => console.log("demo up on http://localhost:4000"));