// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */

import "./utils/bigint-serializer";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { json } from "body-parser";
import dotenv from "dotenv";
// import { typeDefs } from "./graphql/typedef/schema";
import { typeDefs, resolvers } from "./graphql/module/schema";
// import { resolvers } from "./graphql/resolvers/resolver";
import { createContext } from "./utils/context";

dotenv.config();

async function init() {
  const app = express();
  app.use(json());
  const PORT = process.env.PORT || 8000;

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => createContext({ req }),
    }),
  );

  // app.get("/", (_req, res) => res.json({ message: "Server is running" }));

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

init();
