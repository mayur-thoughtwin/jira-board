/* eslint-disable @typescript-eslint/no-explicit-any */
// schema/resolvers/boardStatus.ts
import { PrismaClient } from "@prisma/client";
// import { Context } from "../../../utils/context";
const prisma = new PrismaClient();

export const boardStatusResolvers = {
  Query: {
    boardStatuses: async () => {
      return prisma.boardStatus.findMany({
        where: { delete_flag: false },
        include: { tickets: true },
      });
    },
    boardStatus: async (_: any, args: { id: string }) => {
      return prisma.boardStatus.findUnique({
        where: { id: BigInt(args.id) },
        include: { tickets: true },
      });
    },
  },

  Mutation: {
    createBoardStatus: async (
      _: any,
      args: { name: string; status_category: string },
      // context: Context,
    ) => {
      // const { user, prisma } = context;

      // if (!user) {
      //   throw new Error("Unauthorized");
      // }

      // Check if a BoardStatus with the same name already exists
      const existing = await prisma.boardStatus.findFirst({
        where: {
          name: args.name,
          delete_flag: false, // Optional: if you're using soft delete
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
      // context: Context,
    ) => {
      // const { user, prisma } = context;

      // if (!user) {
      //   throw new Error("Unauthorized");
      // }

      try {
        const id = BigInt(args.id);

        // If name is being updated, check for duplicates
        if (args.name) {
          const duplicate = await prisma.boardStatus.findFirst({
            where: {
              name: args.name,
              id: { not: id },
              delete_flag: false, // optional, based on your schema
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

    deleteBoardStatus: async (_: any, args: { id: string }) => {
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
