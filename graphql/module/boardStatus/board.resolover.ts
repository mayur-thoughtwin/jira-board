/* eslint-disable @typescript-eslint/no-explicit-any */
// schema/resolvers/boardStatus.ts
import { PrismaClient } from "@prisma/client";
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
    createBoardStatus: async (_: any, args: { name: string; status_category: string }) => {
      const created = await prisma.boardStatus.create({
        data: {
          name: args.name,
          status_category: args.status_category as any,
        },
        include: { tickets: true },
      });
      return created;
    },

    updateBoardStatus: async (
      _: any,
      args: { id: string; name?: string; status_category?: string },
    ) => {
      try {
        await prisma.boardStatus.update({
          where: { id: BigInt(args.id) },
          data: {
            ...(args.name && { name: args.name }),
            ...(args.status_category && {
              status_category: args.status_category as any,
            }),
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
