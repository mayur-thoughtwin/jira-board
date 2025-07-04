/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Context } from "../../../utils/context";
import { errorMessage } from "../../../constants/errormessage";
import { successMessage } from "../../../constants/successmessage";
import { generateOtpCodeWithExpiry } from "../../../utils/otp";
import { sendEmail } from "../../../utils/send.email";
import { comparePassword, hashPassword } from "../../../utils/comparePassword";
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || "supersecretkey";

export const auhtResolvers = {
  Mutation: {
    createUser: async (_: any, args: any) => {
      const { firstName, lastName, email, password, role, jobTitle, department, organization } =
        args;

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser?.otp_verified === true) {
        throw new Error(errorMessage.USER_EXISTS);
      }

      const { otp, expiresAt } = generateOtpCodeWithExpiry();
      const hashedPassword = await hashPassword(password);

      const userData = {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        role,
        job_title: jobTitle,
        department,
        organization,
        otp: Number(otp),
        otp_expires_at: expiresAt,
        otp_verified: false,
      };

      if (existingUser?.otp_verified === false) {
        await prisma.user.update({
          where: { email },
          data: userData,
        });
      } else {
        await prisma.user.create({
          data: {
            email,
            ...userData,
          },
        });
      }
      await sendEmail({
        to: email,
        subject: "OTP Verification",
        template: "otp",
        context: {
          name: firstName,
          otp,
        },
      });

      return {
        status: true,
        message: successMessage.OTP_SENT,
        timestamp: new Date().toISOString(),
      };
    },
    otpVerify: async (_: any, { email, otp }: { email: string; otp: number }) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) throw new Error(errorMessage.USER_NOT_FOUND);

      if (user.otp !== otp) {
        throw new Error(errorMessage.INVALID_OTP);
      }

      if (!user.otp_expires_at || user.otp_expires_at < new Date()) {
        throw new Error(errorMessage.OTP_EXPIRED);
      }

      await prisma.user.update({
        where: { email },
        data: { otp_verified: true },
      });

      return {
        status: true,
        message: successMessage.OTP_VERIFIED,
        timestamp: new Date().toISOString(),
      };
    },
    login: async (_: any, { email, password }: any) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) throw new Error(errorMessage.INVALID_CREDENTIALS);

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) throw new Error(errorMessage.INVALID_CREDENTIALS);

      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, SECRET, {
        expiresIn: "7d",
      });

      return token;
    },
    changePassword: async (
      _: any,
      { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
      context: Context,
    ) => {
      const { user, prisma } = context;
      console.log(" user:", user);
      if (!user || !user.email) {
        throw new Error("Unauthorized");
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        throw new Error(errorMessage.USER_NOT_FOUND);
      }

      // Directly compare the passwords without additional hashing
      const isOldPasswordCorrect = await comparePassword(oldPassword, existingUser.password);
      if (!isOldPasswordCorrect) {
        throw new Error(errorMessage.INVALID_OLD_PASSWORD || "Old password is incorrect");
      }

      // Hash and save the new password
      const hashedNewPassword = await hashPassword(newPassword);
      await prisma.user.update({
        where: { email: user.email },
        data: { password: hashedNewPassword, password_changed_at: new Date() },
      });

      return {
        status: true,
        message: successMessage.PASSWORD_CHANGED || "Password updated successfully",
        timestamp: new Date().toISOString(),
      };
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
          delete_flag: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!foundUser) {
        throw new Error(errorMessage.USER_NOT_FOUND);
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
    deleteFlag: (parent: { delete_flag: any }) => parent.delete_flag,
  },
};
