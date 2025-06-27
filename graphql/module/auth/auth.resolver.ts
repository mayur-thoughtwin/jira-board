/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Context } from "../../../utils/context";

const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export const auhtResolvers = {
  Mutation: {
    createUser: async (_: any, args: any) => {
      const { firstName, lastName, email, password, role, jobTitle, department, organization } =
        args;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("User with this email already exists.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          password: hashedPassword,
          role,
          job_title: jobTitle,
          department,
          organization,
        },
      });

      return {
        status: true,
        message: "User created successfully",
        timestamp: new Date().toISOString(),
      };
    },

    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) throw new Error("Invalid email or password");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid email or password");

      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, SECRET, {
        expiresIn: "7d",
      });

      return token;
    },
  },
  Query: {
    users: async (_: any, __: any, context: Context) => {
      const { user, prisma } = context;
      console.log("Context user:", user?.role);

      if (!user || !["PROJECT_MANAGER", "USER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }

      return await prisma.user.findMany({
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          job_title: true,
          department: true,
          organization: true,
          is_active: true,
          delete_flag: true,
          created_at: true,
          updated_at: true,
        },
      });
    },

    user: async (_: any, { id }: { id: string }, context: Context) => {
      const { user, prisma } = context;

      if (!user) {
        throw new Error("Unauthorized");
      }

      const foundUser = await prisma.user.findUnique({
        where: { id: BigInt(id) },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          job_title: true,
          department: true,
          organization: true,
          is_active: true,
          delete_flag: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!foundUser) {
        throw new Error("User not found");
      }

      return foundUser;
    },
  },
  User: {
    firstName: (parent: { first_name: any }) => parent.first_name,
    lastName: (parent: { last_name: any }) => parent.last_name,
    jobTitle: (parent: { job_title: any }) => parent.job_title,
    createdAt: (parent: { created_at: any }) => parent.created_at,
    updatedAt: (parent: { updated_at: any }) => parent.updated_at,
    isActive: (parent: { is_active: any }) => parent.is_active,
    deleteFlag: (parent: { delete_flag: any }) => parent.delete_flag,
  },
};
