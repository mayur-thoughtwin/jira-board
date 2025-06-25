/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
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
    createTicket: async (_: any, args: any) =>
      prisma.ticket.create({
        data: {
          ticket_key: args.ticket_key,
          project_id: BigInt(args.project_id),
          work_type: args.work_type,
          summary: args.summary,
          description: args.description,
          status_id: BigInt(args.status_id),
          created_by_id: BigInt(args.created_by_id),
          parent_id: args.parent_id ? BigInt(args.parent_id) : null,
        },
      }),

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
