/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "../../../utils/context";
import { requireRole } from "../../../utils/requireRole";

export const userCollaboratorResolvers = {
  Query: {},
  Mutation: {
    addUserCollaborator: async (
      _: any,
      args: { projectId: string; collaboratorId: string },
      context: Context,
    ) => {
      const { user, prisma } = context;

      requireRole(context, ["ADMIN", "PROJECT_MANAGER"]);

      try {
        if (!user?.userId) {
          return {
            status: false,
            message: "User is not authenticated.",
            timestamp: new Date().toISOString(),
          };
        }

        const userId = BigInt(user.userId);
        const projectId = BigInt(args.projectId);
        const collaboratorId = BigInt(args.collaboratorId);

        if (userId === collaboratorId) {
          return {
            status: false,
            message: "You cannot add yourself as a collaborator.",
            timestamp: new Date().toISOString(),
          };
        }

        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: { id: true },
        });

        if (!project) {
          return {
            status: false,
            message: "Project not found.",
            timestamp: new Date().toISOString(),
          };
        }

        const collaboratorUser = await prisma.user.findUnique({
          where: { id: collaboratorId },
          select: { id: true },
        });

        if (!collaboratorUser) {
          return {
            status: false,
            message: "Collaborator user not found.",
            timestamp: new Date().toISOString(),
          };
        }

        await prisma.userCollaborator.create({
          data: {
            user_id: userId,
            collaborator_id: collaboratorId,
            project_id: projectId,
          },
        });

        return {
          status: true,
          message: "Collaborator added successfully.",
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          status: false,
          message: `Failed to add collaborator: ${
            error instanceof Error ? error.message : String(error)
          }`,
          timestamp: new Date().toISOString(),
        };
      }
    },
  },
};
