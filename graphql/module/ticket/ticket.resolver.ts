/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { Context } from "../../../utils/context";
const prisma = new PrismaClient();

export const ticketResolvers = {
  Query: {
    tickets: () =>
      prisma.ticket.findMany({
        where: { delete_flag: false },
        include: {
          parent: true,
          children: true,
          ticketData: {
            include: {
              labels: true,
              sprint: true,
              assignee: true,
              reporter: true,
            },
          },
          backlogItem: true,
        },
      }),
    ticket: (_: any, args: { id: string }) =>
      prisma.ticket.findUnique({
        where: { id: BigInt(args.id) },
        include: {
          parent: true,
          children: true,
          ticketData: {
            include: {
              labels: true,
              sprint: true,
              assignee: true,
              reporter: true,
            },
          },
          backlogItem: true,
        },
      }),
    ticketLabels: () => prisma.ticketLabel.findMany({ include: { tickets: true } }),
  },

  Mutation: {
    // createTicket: async (_: any, { input }: any, context: Context) => {
    //   const { project_id, work_type, summary, description, status_id, parent_id } = input;
    //   const { user, prisma } = context;

    //   if (!user) {
    //     throw new Error("Unauthorized");
    //   }
    //   if (work_type === "SUBTASK" && !parent_id) {
    //     throw new Error("parent_id is required for work_type 'SUBTASK'");
    //   }

    //   // 1. Get the project_key from the project ID
    //   const project = await prisma.project.findUnique({
    //     where: {
    //       id: BigInt(project_id),
    //     },
    //     select: {
    //       project_key: true,
    //     },
    //   });

    //   if (!project) {
    //     throw new Error("Invalid project ID");
    //   }

    //   const projectKey = project.project_key;

    //   // 2. Find the last ticket for this project to determine the next ticket number
    //   const lastTicket = await prisma.ticket.findFirst({
    //     where: {
    //       project_id: BigInt(project_id),
    //     },
    //     orderBy: {
    //       created_at: "desc",
    //     },
    //     select: {
    //       ticket_key: true,
    //     },
    //   });

    //   // 3. Determine the next ticket number
    //   let nextTicketNumber = 1;
    //   if (lastTicket && lastTicket.ticket_key.startsWith(`${projectKey}-`)) {
    //     const lastNumber = parseInt(lastTicket.ticket_key.split("-")[1]);
    //     if (!isNaN(lastNumber)) {
    //       nextTicketNumber = lastNumber + 1;
    //     }
    //   }

    //   const ticketKey = `${projectKey}-${nextTicketNumber}`;

    //   // 4. Create the ticket
    //   const newTicket = await prisma.ticket.create({
    //     data: {
    //       ticket_key: ticketKey,
    //       project_id: BigInt(project_id),
    //       work_type,
    //       summary,
    //       description,
    //       status_id: BigInt(status_id),
    //       created_by_id: BigInt(user.userId),
    //       parent_id: parent_id ? BigInt(parent_id) : null,
    //     },
    //   });

    //   return newTicket;
    // },
    createTicket: async (_: any, { input }: any, context: Context) => {
      const { project_id, work_type, summary, description, status_id, parent_id } = input;
      const { user, prisma } = context;

      if (!user) {
        throw new Error("Unauthorized");
      }

      if (work_type === "SUBTASK") {
        if (!parent_id) {
          throw new Error("parent_id is required for work_type 'SUBTASK'");
        }

        const parentTicket = await prisma.ticket.findUnique({
          where: { id: BigInt(parent_id) },
          select: {
            id: true,
            project_id: true,
            work_type: true,
          },
        });

        if (!parentTicket) {
          throw new Error("Invalid parent_id: ticket not found");
        }

        if (parentTicket.project_id.toString() !== project_id.toString()) {
          throw new Error("Parent ticket must belong to the same project");
        }

        if (parentTicket.work_type === "SUBTASK") {
          throw new Error("Cannot nest a SUBTASK under another SUBTASK");
        }
      }

      const project = await prisma.project.findUnique({
        where: {
          id: BigInt(project_id),
        },
        select: {
          project_key: true,
        },
      });

      if (!project) {
        throw new Error("Invalid project ID");
      }

      const projectKey = project.project_key;

      const lastTicket = await prisma.ticket.findFirst({
        where: { project_id: BigInt(project_id) },
        orderBy: { created_at: "desc" },
        select: { ticket_key: true },
      });

      let nextTicketNumber = 1;
      if (lastTicket && lastTicket.ticket_key.startsWith(`${projectKey}-`)) {
        const lastNumber = parseInt(lastTicket.ticket_key.split("-")[1]);
        if (!isNaN(lastNumber)) {
          nextTicketNumber = lastNumber + 1;
        }
      }

      const ticketKey = `${projectKey}-${nextTicketNumber}`;

      const newTicket = await prisma.ticket.create({
        data: {
          ticket_key: ticketKey,
          project_id: BigInt(project_id),
          work_type,
          summary,
          description,
          status_id: BigInt(status_id),
          created_by_id: BigInt(user.userId),
          parent_id: parent_id ? BigInt(parent_id) : null,
        },
        include: {
          project: true, // 👈 include related project
          created_by: true, // optional: include creator if needed
        },
      });
      return newTicket;
    },

    updateTicket: async (_: any, args: any) => {
      try {
        await prisma.ticket.update({
          where: { id: BigInt(args.id) },
          data: {
            ...(args.ticket_key && { ticket_key: args.ticket_key }),
            ...(args.summary && { summary: args.summary }),
            ...(args.description && { description: args.description }),
            ...(args.status_id && { status_id: BigInt(args.status_id) }),
            ...(args.work_type && { work_type: args.work_type }),
            ...(args.parent_id !== undefined && { parent_id: BigInt(args.parent_id) }),
            ...(args.delete_flag !== undefined && { delete_flag: args.delete_flag }),
          },
        });

        return {
          status: true,
          message: "Ticket updated successfully.",
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        return {
          status: false,
          message: err.message,
          timestamp: new Date().toISOString(),
        };
      }
    },

    deleteTicket: async (_: any, args: { id: string }) => {
      try {
        await prisma.ticket.update({
          where: { id: BigInt(args.id) },
          data: { delete_flag: true },
        });

        return {
          status: true,
          message: "Ticket soft-deleted.",
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        return {
          status: false,
          message: err.message,
          timestamp: new Date().toISOString(),
        };
      }
    },

    createTicketData: async (_: any, args: any) => {
      return prisma.ticketData.create({
        data: {
          ticket_id: BigInt(args.ticket_id),
          priority: args.priority,
          due_date: args.due_date ? new Date(args.due_date) : null,
          assignee_id: args.assignee_id ? BigInt(args.assignee_id) : null,
          reporter_id: args.reporter_id ? BigInt(args.reporter_id) : null,
          estimate_points: args.estimate_points,
          sprint_id: args.sprint_id ? BigInt(args.sprint_id) : null,
          labels: {
            connect: (args.label_ids || []).map((id: string) => ({
              id: BigInt(id),
            })),
          },
        },
        include: { labels: true },
      });
    },

    updateTicketData: async (_: any, args: any) => {
      try {
        await prisma.ticketData.update({
          where: { ticket_id: BigInt(args.ticket_id) },
          data: {
            ...(args.priority && { priority: args.priority }),
            ...(args.due_date && { due_date: new Date(args.due_date) }),
            ...(args.assignee_id && { assignee_id: BigInt(args.assignee_id) }),
            ...(args.reporter_id && { reporter_id: BigInt(args.reporter_id) }),
            ...(args.estimate_points && { estimate_points: args.estimate_points }),
            ...(args.sprint_id && { sprint_id: BigInt(args.sprint_id) }),
            ...(args.label_ids && {
              labels: {
                set: args.label_ids.map((id: string) => ({ id: BigInt(id) })),
              },
            }),
          },
        });

        return {
          status: true,
          message: "TicketData updated successfully.",
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        return {
          status: false,
          message: err.message,
          timestamp: new Date().toISOString(),
        };
      }
    },
  },
};
