/* eslint-disable @typescript-eslint/no-explicit-any */
// schema/resolvers/boardStatus.ts
// import { PrismaClient } from "@prisma/client";
import { Context } from "../../../utils/context";

export const boardStatusResolvers = {
  Query: {
    boardStatuses: async (_: any, __: any, context: Context) => {
      const { prisma } = context;

      try {
        const statuses = await prisma.boardStatus.findMany({
          where: { delete_flag: false },
          orderBy: { id: "asc" },
        });

        return {
          status: true,
          message: "Data fetched successfully",
          data: statuses,
        };
      } catch (error) {
        return {
          status: false,
          message:
            "Failed to fetch BoardStatuses: " +
            (error instanceof Error ? error.message : String(error)),
          data: [],
        };
      }
    },
    boardStatus: async (_: any, args: { id: string }, context: Context) => {
      const { prisma } = context;

      try {
        const status = await prisma.boardStatus.findUnique({
          where: { id: BigInt(args.id) },
          include: { tickets: true },
        });

        if (!status) {
          return {
            status: false,
            message: "BoardStatus not found",
            data: null,
          };
        }

        return {
          status: true,
          message: "BoardStatus fetched successfully",
          data: status,
        };
      } catch (error) {
        return {
          status: false,
          message:
            "Failed to fetch BoardStatus: " +
            (error instanceof Error ? error.message : String(error)),
          data: null,
        };
      }
    },
  },

  Mutation: {
    createBoardStatus: async (
      _: any,
      args: { name: string; status_category: string },
      context: Context,
    ) => {
      const { user, prisma } = context;

      if (!user || !["ADMIN", "PROJECT_MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }

      console.log("user==>", user);

      const existing = await prisma.boardStatus.findFirst({
        where: {
          name: args.name,
          delete_flag: false,
        },
      });

      if (existing) {
        return {
          status: false,
          message: "BoardStatus with this name already exists.",
          timestamp: new Date().toISOString(),
          boardStatus: null,
        };
      }

      const created = await prisma.boardStatus.create({
        data: {
          name: args.name,
          status_category: args.status_category as any,
        },
        include: { tickets: true },
      });

      return {
        status: true,
        message: "BoardStatus created successfully.",
        timestamp: new Date().toISOString(),
        boardStatus: created,
      };
    },

    updateBoardStatus: async (
      _: any,
      args: { id: string; name?: string; status_category?: string },
      context: Context,
    ) => {
      const { user, prisma } = context;

      if (!user || !["ADMIN", "PROJECT_MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }

      try {
        const id = BigInt(args.id);

        // If name is being updated, check for duplicates
        if (args.name) {
          const duplicate = await prisma.boardStatus.findFirst({
            where: {
              name: args.name,
              id: { not: id },
              delete_flag: false,
            },
          });

          if (duplicate) {
            return {
              status: false,
              message: "Another BoardStatus with this name already exists.",
              timestamp: new Date().toISOString(),
            };
          }
        }

        await prisma.boardStatus.update({
          where: { id },
          data: {
            name: args.name,
            status_category: args.status_category as any,
          },
        });

        return {
          status: true,
          message: "BoardStatus updated successfully.",
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          status: false,
          message: "Update failed: " + (error instanceof Error ? error.message : String(error)),
          timestamp: new Date().toISOString(),
        };
      }
    },

    deleteBoardStatus: async (_: any, args: { id: string }, context: Context) => {
      const { user, prisma } = context;

      // Authorization check
      if (!user || !["ADMIN", "PROJECT_MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized");
      }

      try {
        await prisma.boardStatus.update({
          where: { id: BigInt(args.id) },
          data: { delete_flag: true },
        });

        return {
          status: true,
          message: "BoardStatus soft-deleted successfully.",
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          status: false,
          message: "Delete failed: " + (error instanceof Error ? error.message : String(error)),
          timestamp: new Date().toISOString(),
        };
      }
    },
  },
};
