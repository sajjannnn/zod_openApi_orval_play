import { useState } from "react";
import { useGetUsersId, usePostUsers } from "../../src/client/generated/users/users";

const SEED_ID = "123e4567-e89b-12d3-a456-426614174000";

export default function App() {
  const [id, setId] = useState(SEED_ID);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const userQuery = useGetUsersId(id);
  const createMutation = usePostUsers();

  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", display: "grid", gap: "2rem", maxWidth: 640 }}>
      <div>
        <h2>POST /users — usePostUsers (mutation)</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: "0.5rem" }}
        />
        <button
          onClick={() => createMutation.mutate({ data: { name, email } })}
          disabled={createMutation.isPending}
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
        >
          {createMutation.isPending ? "Creating…" : "Create user"}
        </button>
        {createMutation.isError && (
          <pre style={{ color: "crimson" }}>{JSON.stringify(createMutation.error)}</pre>
        )}
        {createMutation.isSuccess && (
          <pre>Created: {JSON.stringify(createMutation.data?.data, null, 2)}</pre>
        )}
      </div>

      <div>
        <h2>GET /users/{`{id}`} — useGetUsersId (query)</h2>
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ padding: "0.5rem", width: 320 }}
        />
        {userQuery.isPending && <p>Loading…</p>}
        {userQuery.isError && (
          <pre style={{ color: "crimson" }}>{JSON.stringify(userQuery.error)}</pre>
        )}
        {userQuery.isSuccess && (
          <pre>{JSON.stringify(userQuery.data?.data, null, 2)}</pre>
        )}
      </div>
    </main>
  );
}
