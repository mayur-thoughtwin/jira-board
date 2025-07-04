/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./verify.token";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const createContext = async ({ req }: { req: Request }): Promise<Context> => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  // ✅ Skip auth for introspection query
  if (req.body?.operationName === "IntrospectionQuery") {
    return { prisma };
  }

  try {
    const decoded = await verifyToken(token); // wait for async function
    if (!decoded) return { prisma };

    const { userId, email, role } = decoded;
    return {
      prisma,
      user: { userId, email, role },
    };
  } catch (err: any) {
    console.warn("Auth error:", err.message);
    return { prisma }; // Let the request through without user
  }
};
