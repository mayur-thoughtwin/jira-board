/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
    user: async (_: any, args: { id: string }) => {
      return await prisma.user.findUnique({ where: { id: BigInt(args.id) } });
    },

    projects: async () => await prisma.project.findMany(),
    project: async (_: any, args: { id: string }) => {
      return await prisma.project.findUnique({ where: { id: BigInt(args.id) } });
    },

    tickets: async () => await prisma.ticket.findMany(),
    ticket: async (_: any, args: { id: string }) => {
      return await prisma.ticket.findUnique({ where: { id: BigInt(args.id) } });
    },

    sprints: async () => await prisma.sprint.findMany(),
    backlogItems: async () => await prisma.backlog.findMany(),
  },

  Mutation: {
    createUser: async (_: any, args: any) => {
      return await prisma.user.create({ data: args.input });
    },
    createProject: async (_: any, args: any) => {
      return await prisma.project.create({ data: args.input });
    },
    createTicket: async (_: any, args: any) => {
      return await prisma.ticket.create({ data: args.input });
    },
    createSprint: async (_: any, args: any) => {
      return await prisma.sprint.create({ data: args.input });
    },
    createBacklog: async (_: any, args: any) => {
      return await prisma.backlog.create({ data: args.input });
    },
    createTicketData: async (_: any, args: any) => {
      return await prisma.ticketData.create({ data: args.input });
    },
    createLabel: async (_: any, args: any) => {
      return await prisma.ticketLabel.create({ data: args.input });
    },
  },

  User: {
    department: (parent: { department_id: any; }) => prisma.department.findUnique({ where: { id: parent.department_id } }),
    organization: (parent: { organization_id: any; }) =>
      prisma.organization.findUnique({ where: { id: parent.organization_id } }),
    projectsLed: (parent: { id: any; }) => prisma.project.findMany({ where: { project_lead_id: parent.id } }),
    createdTickets: (parent: { id: any; }) => prisma.ticket.findMany({ where: { created_by_id: parent.id } }),
    assignedTickets: (parent: { id: any; }) => prisma.ticketData.findMany({ where: { assignee_id: parent.id } }),
    reportedTickets: (parent: { id: any; }) => prisma.ticketData.findMany({ where: { reporter_id: parent.id } }),
  },

  Project: {
    projectCategory: (parent: { project_category_id: any; }) =>
      prisma.projectCategory.findUnique({ where: { id: parent.project_category_id } }),
    projectLead: (parent: { project_lead_id: any; }) => prisma.user.findUnique({ where: { id: parent.project_lead_id } }),
    tickets: (parent: { id: any; }) => prisma.ticket.findMany({ where: { project_id: parent.id } }),
    sprints: (parent: { id: any; }) => prisma.sprint.findMany({ where: { project_id: parent.id } }),
    backlogItems: (parent: { id: any; }) => prisma.backlog.findMany({ where: { project_id: parent.id } }),
  },

  Ticket: {
    project: (parent: { project_id: any; }) => prisma.project.findUnique({ where: { id: parent.project_id } }),
    parent: (parent: { parent_id: any; }) =>
      parent.parent_id ? prisma.ticket.findUnique({ where: { id: parent.parent_id } }) : null,
    children: (parent: { id: any; }) => prisma.ticket.findMany({ where: { parent_id: parent.id } }),
    status: (parent: { status_id: any; }) => prisma.boardStatus.findUnique({ where: { id: parent.status_id } }),
    createdBy: (parent: { created_by_id: any; }) => prisma.user.findUnique({ where: { id: parent.created_by_id } }),
    ticketData: (parent: { id: any; }) => prisma.ticketData.findUnique({ where: { ticket_id: parent.id } }),
    backlogItem: (parent: { id: any; }) => prisma.backlog.findUnique({ where: { ticket_id: parent.id } }),
  },

  TicketData: {
    ticket: (parent: { ticket_id: any; }) => prisma.ticket.findUnique({ where: { id: parent.ticket_id } }),
    assignee: (parent: { assignee_id: any; }) =>
      parent.assignee_id ? prisma.user.findUnique({ where: { id: parent.assignee_id } }) : null,
    reporter: (parent: { reporter_id: any; }) =>
      parent.reporter_id ? prisma.user.findUnique({ where: { id: parent.reporter_id } }) : null,
    sprint: (parent: { sprint_id: any; }) =>
      parent.sprint_id ? prisma.sprint.findUnique({ where: { id: parent.sprint_id } }) : null,
    labels: (parent: { id: any; }) =>
      prisma.ticketLabel.findMany({ where: { tickets: { some: { id: parent.id } } } }),
  },

  Sprint: {
    project: (parent: { project_id: any; }) => prisma.project.findUnique({ where: { id: parent.project_id } }),
    tickets: (parent: { id: any; }) => prisma.ticketData.findMany({ where: { sprint_id: parent.id } }),
    backlog: (parent: { id: any; }) => prisma.backlog.findMany({ where: { sprint_id: parent.id } }),
  },

  Backlog: {
    ticket: (parent: { ticket_id: any; }) => prisma.ticket.findUnique({ where: { id: parent.ticket_id } }),
    project: (parent: { project_id: any; }) => prisma.project.findUnique({ where: { id: parent.project_id } }),
    sprint: (parent: { sprint_id: any; }) =>
      parent.sprint_id ? prisma.sprint.findUnique({ where: { id: parent.sprint_id } }) : null,
  },

  TicketLabel: {
    tickets: (parent: { id: any; }) =>
      prisma.ticketData.findMany({ where: { labels: { some: { id: parent.id } } } }),
  },
};
