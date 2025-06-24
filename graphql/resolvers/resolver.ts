/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// export const resolvers = {
//   Query: {
//     users: async () => await prisma.user.findMany(),
//     user: async (_: any, args: { id: string }) => {
//       return await prisma.user.findUnique({ where: { id: BigInt(args.id) } });
//     },

//     projects: async () => await prisma.project.findMany(),
//     project: async (_: any, args: { id: string }) => {
//       return await prisma.project.findUnique({ where: { id: BigInt(args.id) } });
//     },

//     tickets: async () => await prisma.ticket.findMany(),
//     ticket: async (_: any, args: { id: string }) => {
//       return await prisma.ticket.findUnique({ where: { id: BigInt(args.id) } });
//     },

//     sprints: async () => await prisma.sprint.findMany(),
//     backlogItems: async () => await prisma.backlog.findMany(),
//   },

//   Mutation: {
//     createUser: async (_: any, args: any) => {
//       return await prisma.user.create({ data: args.input });
//     },
//     createProject: async (_: any, args: any) => {
//       return await prisma.project.create({ data: args.input });
//     },
//     createTicket: async (_: any, args: any) => {
//       return await prisma.ticket.create({ data: args.input });
//     },
//     createSprint: async (_: any, args: any) => {
//       return await prisma.sprint.create({ data: args.input });
//     },
//     createBacklog: async (_: any, args: any) => {
//       return await prisma.backlog.create({ data: args.input });
//     },
//     createTicketData: async (_: any, args: any) => {
//       return await prisma.ticketData.create({ data: args.input });
//     },
//     createLabel: async (_: any, args: any) => {
//       return await prisma.ticketLabel.create({ data: args.input });
//     },
//   },

//   User: {
//     department: (parent: { department_id: any; }) => prisma.department.findUnique({ where: { id: parent.department_id } }),
//     organization: (parent: { organization_id: any; }) =>
//       prisma.organization.findUnique({ where: { id: parent.organization_id } }),
//     projectsLed: (parent: { id: any; }) => prisma.project.findMany({ where: { project_lead_id: parent.id } }),
//     createdTickets: (parent: { id: any; }) => prisma.ticket.findMany({ where: { created_by_id: parent.id } }),
//     assignedTickets: (parent: { id: any; }) => prisma.ticketData.findMany({ where: { assignee_id: parent.id } }),
//     reportedTickets: (parent: { id: any; }) => prisma.ticketData.findMany({ where: { reporter_id: parent.id } }),
//   },

//   Project: {
//     projectCategory: (parent: { project_category_id: any; }) =>
//       prisma.projectCategory.findUnique({ where: { id: parent.project_category_id } }),
//     projectLead: (parent: { project_lead_id: any; }) => prisma.user.findUnique({ where: { id: parent.project_lead_id } }),
//     tickets: (parent: { id: any; }) => prisma.ticket.findMany({ where: { project_id: parent.id } }),
//     sprints: (parent: { id: any; }) => prisma.sprint.findMany({ where: { project_id: parent.id } }),
//     backlogItems: (parent: { id: any; }) => prisma.backlog.findMany({ where: { project_id: parent.id } }),
//   },

//   Ticket: {
//     project: (parent: { project_id: any; }) => prisma.project.findUnique({ where: { id: parent.project_id } }),
//     parent: (parent: { parent_id: any; }) =>
//       parent.parent_id ? prisma.ticket.findUnique({ where: { id: parent.parent_id } }) : null,
//     children: (parent: { id: any; }) => prisma.ticket.findMany({ where: { parent_id: parent.id } }),
//     status: (parent: { status_id: any; }) => prisma.boardStatus.findUnique({ where: { id: parent.status_id } }),
//     createdBy: (parent: { created_by_id: any; }) => prisma.user.findUnique({ where: { id: parent.created_by_id } }),
//     ticketData: (parent: { id: any; }) => prisma.ticketData.findUnique({ where: { ticket_id: parent.id } }),
//     backlogItem: (parent: { id: any; }) => prisma.backlog.findUnique({ where: { ticket_id: parent.id } }),
//   },

//   TicketData: {
//     ticket: (parent: { ticket_id: any; }) => prisma.ticket.findUnique({ where: { id: parent.ticket_id } }),
//     assignee: (parent: { assignee_id: any; }) =>
//       parent.assignee_id ? prisma.user.findUnique({ where: { id: parent.assignee_id } }) : null,
//     reporter: (parent: { reporter_id: any; }) =>
//       parent.reporter_id ? prisma.user.findUnique({ where: { id: parent.reporter_id } }) : null,
//     sprint: (parent: { sprint_id: any; }) =>
//       parent.sprint_id ? prisma.sprint.findUnique({ where: { id: parent.sprint_id } }) : null,
//     labels: (parent: { id: any; }) =>
//       prisma.ticketLabel.findMany({ where: { tickets: { some: { id: parent.id } } } }),
//   },

//   Sprint: {
//     project: (parent: { project_id: any; }) => prisma.project.findUnique({ where: { id: parent.project_id } }),
//     tickets: (parent: { id: any; }) => prisma.ticketData.findMany({ where: { sprint_id: parent.id } }),
//     backlog: (parent: { id: any; }) => prisma.backlog.findMany({ where: { sprint_id: parent.id } }),
//   },

//   Backlog: {
//     ticket: (parent: { ticket_id: any; }) => prisma.ticket.findUnique({ where: { id: parent.ticket_id } }),
//     project: (parent: { project_id: any; }) => prisma.project.findUnique({ where: { id: parent.project_id } }),
//     sprint: (parent: { sprint_id: any; }) =>
//       parent.sprint_id ? prisma.sprint.findUnique({ where: { id: parent.sprint_id } }) : null,
//   },

//   TicketLabel: {
//     tickets: (parent: { id: any; }) =>
//       prisma.ticketData.findMany({ where: { labels: { some: { id: parent.id } } } }),
//   },
// };

import { PrismaClient } from "@prisma/client";
import { successMessage } from "../../constants/successmessage";
import { errorMessage } from "../../constants/errormessage";
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    users: async () => {
      const users = await prisma.user.findMany();
      return users.map((user: any) => ({
        id: user.id.toString(),
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        isActive: user.is_active,
        role: user.role,
        jobTitle: user.job_title,
        departmentId: user.department_id,
        organizationId: user.organization_id,
        deleteFlag: user.delete_flag,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      }));
    },

    user: async (_: any, { id }: { id: string }) => {
      const user = await prisma.user.findUnique({ where: { id: BigInt(id) } });
      if (!user) return null;
      return {
        id: user.id.toString(), // Convert BigInt to string for GraphQL compatibility
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        isActive: user.is_active,
        role: user.role,
        jobTitle: user.job_title,
        departmentId: user.department_id,
        organizationId: user.organization_id,
        deleteFlag: user.delete_flag,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    },

    departments: async () => await prisma.department.findMany(),
    department: async (_: any, { id }: any) =>
      await prisma.department.findUnique({ where: { id: BigInt(id) } }),

    organizations: async () => await prisma.organization.findMany(),
    organization: async (_: any, { id }: any) =>
      await prisma.organization.findUnique({ where: { id: BigInt(id) } }),
  },
  Mutation: {
    createUser: async (_: any, args: any, context: any) => {
      const { prisma } = context;
      const user = await prisma.user.create({
        data: {
          first_name: args.firstName,
          last_name: args.lastName,
          email: args.email,
          role: args.role,
          job_title: args.jobTitle,
          department_id: args.departmentId ? BigInt(args.departmentId) : null,
          organization_id: args.organizationId ? BigInt(args.organizationId) : null,
        },
      });

      return {
        id: user.id,
        firstName: user.first_name, // map snake_case to camelCase
        lastName: user.last_name,
        email: user.email,
        isActive: user.is_active,
        role: user.role,
        jobTitle: user.job_title,
        departmentId: user.department_id,
        organizationId: user.organization_id,
        deleteFlag: user.delete_flag,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      };
    },

    updateUser: async (_: any, args: any) => {
      try {
        return await prisma.user.update({
          where: { id: BigInt(args.id) },
          data: args.input,
        });
      } catch {
        throw new Error("User not found or update failed");
      }
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      try {
        await prisma.user.delete({ where: { id: BigInt(id) } });
        return true;
      } catch {
        throw new Error("User not found or delete failed");
      }
    },
    createDepartment: async (_: any, args: { name: string }, context: any) => {
      try {
        const { prisma } = context;

        // Check if department already exists
        const existing = await prisma.department.findFirst({
          where: { name: args.name },
        });

        if (existing) {
          return {
            status: false,
            message: "Department already exists",
            timestamp: new Date().toISOString(),
          };
        }

        // Create the department
        await prisma.department.create({
          data: {
            name: args.name,
          },
        });

        return {
          status: true,
          message: successMessage.DEPARTMENT_CREATED,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        return {
          status: false,
          message: err instanceof Error ? err.message : "Unexpected error",
          timestamp: new Date().toISOString(),
        };
      }
    },
    updateDepartment: async (_: any, { id, name }: any) => {
      return await prisma.department.update({
        where: { id: BigInt(id) },
        data: { name },
      });
    },

    createOrganization: async (_: any, args: { name: string }, context: any) => {
      try {
        const { prisma } = context;

        // Check if organization already exists
        const existing = await prisma.organization.findFirst({
          where: { name: args.name },
        });

        if (existing) {
          return {
            status: false,
            message: "Organization already exists",
            timestamp: new Date().toISOString(),
          };
        }

        // Create the organization
        await prisma.organization.create({
          data: {
            name: args.name,
          },
        });

        return {
          status: true,
          message: "Organization created successfully",
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        return {
          status: false,
          message: err instanceof Error ? err.message : "Unexpected error",
          timestamp: new Date().toISOString(),
        };
      }
    },
    updateOrganization: async (_: any, { id, name }: { id: string; name: string }) => {
      return await prisma.organization.update({
        where: { id: BigInt(id) },
        data: { name },
      });
    },
    createProject: async (
      _: any,
      args: {
        name: string;
        projectKey: string;
        icon?: string;
        projectCategoryId: string;
        projectLeadId: string;
      },
      context: any,
    ) => {
      try {
        const { prisma } = context;

        // Check if project with same key exists
        const existing = await prisma.project.findFirst({
          where: { project_key: args.projectKey },
        });

        if (existing) {
          return {
            status: false,
            message: errorMessage.PROJECT_EXISTS,
            timestamp: new Date().toISOString(),
          };
        }

        await prisma.project.create({
          data: {
            name: args.name,
            project_lead_id: BigInt(args.projectLeadId),
            project_category_id: BigInt(args.projectCategoryId),
            project_key: args.projectKey,
            icon: args.icon ?? null,
          },
        });

        return {
          status: true,
          message: successMessage.PROJECT_CREATED,
          timestamp: new Date().toISOString(),
        };
      } catch (err) {
        return {
          status: false,
          message: err instanceof Error ? err.message : "Unexpected error",
          timestamp: new Date().toISOString(),
        };
      }
    },
  },

  Department: {
    users: async (parent: { id: any }) => {
      return await prisma.user.findMany({ where: { department_id: parent.id } });
    },
  },

  Organization: {
    users: async (parent: { id: any }) => {
      return await prisma.user.findMany({ where: { organization_id: parent.id } });
    },
  },
};
