/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

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
};
