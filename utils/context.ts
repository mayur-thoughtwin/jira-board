import { Request } from "express";
import { verifyToken } from "./auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const createContext = ({ req }: { req: Request }): Context => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  const user = verifyToken(token);

  return {
    prisma,
    user: user || undefined,
  };
};
