/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, SprintStatus } from "@prisma/client";

const prisma = new PrismaClient();

interface MutationResponse {
  status: boolean;
  message: string;
  timestamp: string;
}

export const sprintResolvers = {
  Query: {
    sprints: () =>
      prisma.sprint.findMany({
        include: {
          tickets: true,
          backlog: true,
        },
      }),
    sprint: (_: any, args: { id: string }) =>
      prisma.sprint.findUnique({
        where: { id: BigInt(args.id) },
        include: {
          tickets: true,
          backlog: true,
        },
      }),
  },

  Mutation: {
    createSprint: async (
      _: any,
      args: {
        name: string;
        goal?: string;
        project_id: string;
        start_date: string;
        end_date: string;
        status: SprintStatus;
      },
    ) => {
      return prisma.sprint.create({
        data: {
          name: args.name,
          goal: args.goal,
          project_id: BigInt(args.project_id),
          start_date: new Date(args.start_date),
          end_date: new Date(args.end_date),
          status: args.status,
        },
      });
    },

    updateSprint: async (
      _: any,
      args: {
        id: string;
        name?: string;
        goal?: string;
        start_date?: string;
        end_date?: string;
        status?: SprintStatus;
      },
    ): Promise<MutationResponse> => {
      try {
        await prisma.sprint.update({
          where: { id: BigInt(args.id) },
          data: {
            ...(args.name && { name: args.name }),
            ...(args.goal !== undefined && { goal: args.goal }),
            ...(args.start_date && { start_date: new Date(args.start_date) }),
            ...(args.end_date && { end_date: new Date(args.end_date) }),
            ...(args.status && { status: args.status }),
          },
        });

        return {
          status: true,
          message: "Sprint updated successfully.",
          timestamp: new Date().toISOString(),
        };
      } catch (error: any) {
        return {
          status: false,
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    },

    deleteSprint: async (_: any, args: { id: string }): Promise<MutationResponse> => {
      try {
        await prisma.sprint.delete({
          where: { id: BigInt(args.id) },
        });

        return {
          status: true,
          message: "Sprint deleted successfully.",
          timestamp: new Date().toISOString(),
        };
      } catch (error: any) {
        return {
          status: false,
          message: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    },
  },
};
