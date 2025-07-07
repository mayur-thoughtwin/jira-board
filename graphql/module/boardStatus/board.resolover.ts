/* eslint-disable @typescript-eslint/no-explicit-any */
// schema/resolvers/boardStatus.ts
// import { PrismaClient } from "@prisma/client";
import { successMessage } from "../../../constants/successmessage";
import { Context } from "../../../utils/context";
import { requireRole } from "../../../utils/requireRole";
import { errorMessage } from "../../../constants/errormessage";

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
          message: successMessage.DATA_FETCHED,
          timestamp: new Date().toISOString(),
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
            message: errorMessage.BOARD_STATUS_NOT_FOUND,
            timestamp: new Date().toISOString(),
            data: null,
          };
        }

        return {
          status: true,
          timestamp: new Date().toISOString(),
          message: successMessage.DATA_FETCHED,
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
      args: { name: string; status_category: string; project_id: string },
      context: Context,
    ) => {
      const { prisma, user } = context;

      requireRole(context, ["ADMIN", "PROJECT_MANAGER"]);

      const projectId = BigInt(args.project_id);

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return {
          status: false,
          message: errorMessage.PROJECT_NOT_FOUND,
          timestamp: new Date().toISOString(),
          boardStatus: null,
        };
      }

      if (!user || project.project_lead_id !== BigInt(user.userId)) {
        return {
          status: false,
          message: errorMessage.NOT_PROJECT_LEAD,
          timestamp: new Date().toISOString(),
          boardStatus: null,
        };
      }

      const existing = await prisma.boardStatus.findFirst({
        where: {
          name: args.name,
          project_id: projectId,
          delete_flag: false,
        },
      });

      if (existing) {
        return {
          status: false,
          message: errorMessage.BOARD_STATUS_EXISTS,
          timestamp: new Date().toISOString(),
          boardStatus: null,
        };
      }

      const created = await prisma.boardStatus.create({
        data: {
          name: args.name,
          status_category: args.status_category as any,
          project_id: projectId,
        },
        include: { tickets: true },
      });

      return {
        status: true,
        message: successMessage.BOARD_STATUS_CREATED,
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
              message: errorMessage.BOARD_STATUS_EXISTS,
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
          message: successMessage.BOARD_STATUS_UPDATED,
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
          message: successMessage.BOARD_STATUS_DELETED,
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
