/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { Context } from "../../../utils/context";
import { requireRole } from "../../../utils/requireRole";
import { successMessage } from "../../../constants/successmessage";
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
    createProject: async (_: any, { input }: any, context: Context) => {
      const { user, prisma } = context;

      requireRole(context, ["PROJECT_MANAGER"]);

      try {
        if (!user?.userId) {
          throw new Error("Invalid token: userId missing");
        }

        const data: any = {
          name: input.name,
          project_key: input.project_key,
          icon: null,
          project_lead_id: BigInt(user.userId),
        };

        if (input.project_category_id !== undefined && input.project_category_id !== null) {
          data.project_category_id = BigInt(input.project_category_id);
        }

        await prisma.project.create({ data });

        return {
          status: true,
          message: successMessage.PROJECT_CREATED,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          status: false,
          message:
            "Project creation failed: " + (error instanceof Error ? error.message : String(error)),
          timestamp: new Date().toISOString(),
        };
      }
    },
    updateProject: async (_: any, { input }: any, context: Context) => {
      requireRole(context, ["PROJECT_MANAGER"]);
      const { user, prisma } = context;

      try {
        const project = await prisma.project.findUnique({
          where: { id: BigInt(input.id) },
        });

        if (!project) {
          throw new Error("Project not found");
        }

        if (user?.userId === undefined) {
          throw new Error("Invalid token: userId missing");
        }
        if (project.project_lead_id !== BigInt(user.userId)) {
          throw new Error("You are not authorized to update this project.");
        }

        const data: any = {
          ...(input.name && { name: input.name }),
          ...(input.project_key && { project_key: input.project_key }),
          ...(input.icon !== undefined && { icon: input.icon }),
          ...(input.project_category_id !== undefined && {
            project_category_id: BigInt(input.project_category_id),
          }),
          ...(input.project_lead_id !== undefined && {
            project_lead_id: BigInt(input.project_lead_id),
          }),
          ...(input.delete_flag !== undefined && { delete_flag: input.delete_flag }),
        };

        await prisma.project.update({
          where: { id: BigInt(input.id) },
          data,
        });

        return {
          status: true,
          message: successMessage.PROJECT_UPDATED,
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
    deleteProject: async (_: any, { id }: { id: bigint }) => {
      await prisma.project.delete({ where: { id: BigInt(id) } });

      return {
        status: true,
        message: successMessage.PROJECT_DELETED,
        timestamp: new Date().toISOString(),
      };
    },
  },
};
