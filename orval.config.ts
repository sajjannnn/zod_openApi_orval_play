import { defineConfig } from "orval";

export default defineConfig({
  demo: {
    input: "./openapi.json",
    output: {
      mode: "tags-split",
      target: "./src/client/generated",
      schemas: "./src/client/models",
      client: "react-query",
      httpClient: "fetch",
      override: {
        mutator: { path: "./src/client/custom-fetch.ts", name: "customFetch" },
        query: { signal: true },
      },
    },
  },
});
