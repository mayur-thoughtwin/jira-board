/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecretkey";
export async function verifyToken(token?: string) {
  if (!token) throw new Error("TOKEN_MISSING");
  try {
    const decoded = jwt.verify(token, SECRET) as {
      userId: string;
      email: string;
      role: string;
      iat?: number;
    };
    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) },
      select: { password_changed_at: true },
    });
    if (!user) throw new Error("USER_NOT_FOUND");
    if (
      user.password_changed_at &&
      decoded.iat &&
      new Date(decoded.iat * 1000) < user.password_changed_at
    ) {
      throw new Error("PASSWORD_CHANGED");
    }
    return decoded;
  } catch (err: any) {
    console.error("Token verification failed:", err.message);
    throw new Error(err.message || "INVALID_TOKEN");
  }
}
