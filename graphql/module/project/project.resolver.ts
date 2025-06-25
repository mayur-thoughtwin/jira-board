/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const projectResolvers = {
  Query: {
    projects: async () => {
      return await prisma.project.findMany({
        include: {
          project_category: true,
          project_lead: true,
          tickets: true,
          sprints: true,
          backlogItems: true,
        },
      });
    },
    project: async (_: any, { id }: { id: bigint }) => {
      return await prisma.project.findUnique({
        where: { id: BigInt(id) },
        include: {
          project_category: true,
          project_lead: true,
          tickets: true,
          sprints: true,
          backlogItems: true,
        },
      });
    },
  },

  Mutation: {
    createProject: async (_: any, { input }: any) => {
      return await prisma.project.create({
        data: {
          name: input.name,
          project_key: input.project_key,
          icon: input.icon,
          project_category_id: BigInt(input.project_category_id),
          project_lead_id: BigInt(input.project_lead_id),
        },
        include: {
          project_category: true,
          project_lead: true,
          tickets: true,
          sprints: true,
          backlogItems: true,
        },
      });
    },

    updateProject: async (_: any, { input }: any) => {
      return await prisma.project.update({
        where: { id: BigInt(input.id) },
        data: {
          name: input.name,
          project_key: input.project_key,
          icon: input.icon,
          project_category_id: input.project_category_id && BigInt(input.project_category_id),
          project_lead_id: input.project_lead_id && BigInt(input.project_lead_id),
          delete_flag: input.delete_flag,
        },
        include: {
          project_category: true,
          project_lead: true,
          tickets: true,
          sprints: true,
          backlogItems: true,
        },
      });
    },

    deleteProject: async (_: any, { id }: { id: bigint }) => {
      await prisma.project.delete({ where: { id: BigInt(id) } });

      return {
        status: true,
        message: "Project deleted successfully",
        timestamp: new Date().toISOString(),
      };
    },
  },
};
