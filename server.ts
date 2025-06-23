/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { PrismaClient } from "@prisma/client";
import { json } from "body-parser";
import { typeDefs } from "./graphql/typedef/schema";
// import { resolvers } from "./graphql/resolvers/resolver";


const prisma = new PrismaClient();
const typedef = typeDefs;
const resolvers = {};

async function init() {
  if (prisma) {
    console.log("DB connection established successfully");
  }
  const app = express();
  app.use(json());
  const PORT = process.env.PORT || 8000;

  const server = new ApolloServer({ typeDefs, resolvers  });
  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.get("/", (_req: any, res: any) => res.json({ message: "Server is running" }));

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

init();
