/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const projectCategoryResolvers = {
  Query: {
    projectCategories: async () => {
      return await prisma.projectCategory.findMany({ include: { projects: true } });
    },
    projectCategory: async (_: any, { id }: { id: bigint }) => {
      return await prisma.projectCategory.findUnique({
        where: { id: BigInt(id) },
        include: { projects: true },
      });
    },
  },

  Mutation: {
    createProjectCategory: async (_: any, { input }: any) => {
      await prisma.projectCategory.create({
        data: {
          name: input.name,
          description: input.description,
        },
        include: { projects: true },
      });
      return {
        status: true,
        message: "Project category created successfully",
        timestamp: new Date().toISOString(),
      };
    },

    updateProjectCategory: async (_: any, { input }: any) => {
      await prisma.projectCategory.update({
        where: { id: BigInt(input.id) },
        data: {
          name: input.name,
          description: input.description,
          delete_flag: input.delete_flag,
        },
        include: { projects: true },
      });
      return {
        status: true,
        message: "Project category updated successfully",
        timestamp: new Date().toISOString(),
      };
    },

    deleteProjectCategory: async (_: any, { id }: { id: bigint }) => {
      await prisma.projectCategory.delete({ where: { id: BigInt(id) } });

      return {
        status: true,
        message: "Project category deleted successfully",
        timestamp: new Date().toISOString(),
      };
    },
  },
};
