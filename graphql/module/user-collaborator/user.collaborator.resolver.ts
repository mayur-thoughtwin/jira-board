/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "../../../utils/context";
import { requireRole } from "../../../utils/requireRole";
import { sendEmail } from "../../../utils/send.email";

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
          select: { id: true, name: true },
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
        const collaboratorEmail = await prisma.user.findUnique({
          where: { id: collaboratorId },
          select: { email: true, first_name: true },
        });
        console.log("collaboratorEmail", collaboratorEmail?.email);
        await sendEmail({
          to: collaboratorEmail?.email || "",
          subject: "You have been added as a collaborator",
          template: "invite",
          context: {
            name: collaboratorEmail?.first_name || "",
            projectName: project.name,
            collaboratorName: collaboratorEmail?.first_name || "",
            platformName: "JIRA",
            // inviteLink: `https://yourapp.com/invite/${someTokenOrId}`,
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
    removeUserCollaborator: async (
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
            message: "You cannot remove yourself as a collaborator.",
            timestamp: new Date().toISOString(),
          };
        }

        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: { id: true, name: true },
        });

        if (!project) {
          return {
            status: false,
            message: "Project not found.",
            timestamp: new Date().toISOString(),
          };
        }

        const existingCollaborator = await prisma.userCollaborator.findUnique({
          where: {
            user_id_collaborator_id: {
              user_id: userId,
              collaborator_id: collaboratorId,
            },
          },
        });

        if (!existingCollaborator) {
          return {
            status: false,
            message: "Collaborator not found for this project.",
            timestamp: new Date().toISOString(),
          };
        }

        await prisma.userCollaborator.delete({
          where: {
            user_id_collaborator_id: {
              user_id: userId,
              collaborator_id: collaboratorId,
            },
          },
        });

        return {
          status: true,
          message: "Collaborator removed successfully.",
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          status: false,
          message: `Failed to remove collaborator: ${
            error instanceof Error ? error.message : String(error)
          }`,
          timestamp: new Date().toISOString(),
        };
      }
    },
  },
};
