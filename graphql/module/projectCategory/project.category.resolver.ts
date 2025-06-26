/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { Context } from "../../../utils/context";
import { requireRole } from "../../../utils/requireRole";

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
    createProjectCategory: async (_: any, { input }: any, context: Context) => {
      requireRole(context, ["PROJECT_MANAGER"]);
      const existing = await context.prisma.projectCategory.findFirst({
        where: {
          name: input.name,
          delete_flag: false,
        },
      });

      if (existing) {
        return {
          status: false,
          message: "Project category with this name already exists.",
          timestamp: new Date().toISOString(),
        };
      }

      await context.prisma.projectCategory.create({
        data: {
          name: input.name,
          description: input.description ?? null,
        },
      });

      return {
        status: true,
        message: "Project category created successfully.",
        timestamp: new Date().toISOString(),
      };
    },
    updateProjectCategory: async (_: any, { input }: any, context: Context) => {
      requireRole(context, ["PROJECT_MANAGER"]);

      const existing = await context.prisma.projectCategory.findFirst({
        where: {
          id: BigInt(input.id),
          delete_flag: false,
        },
      });

      if (!existing) {
        return {
          status: false,
          message: "Project category not found.",
          timestamp: new Date().toISOString(),
        };
      }

      await context.prisma.projectCategory.update({
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
