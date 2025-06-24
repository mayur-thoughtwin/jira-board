// export const typeDefs = /* GraphQL */ `
//   enum Role {
//     ADMIN
//     PROJECT_MANAGER
//     DEVELOPER
//     QA
//     REPORTER
//   }

//   enum StatusCategory {
//     TODO
//     IN_PROGRESS
//     DONE
//   }

//   enum WorkType {
//     EPIC
//     FEATURE
//     BUG
//     STORY
//     TASK
//     SUBTASK
//   }

//   enum Priority {
//     LOW
//     MEDIUM
//     HIGH
//     CRITICAL
//   }

//   enum SprintStatus {
//     FUTURE
//     ACTIVE
//     COMPLETED
//   }

//   type Department {
//     id: ID!
//     name: String!
//     createdAt: String!
//     updatedAt: String!
//     users: [User!]
//   }

//   type Organization {
//     id: ID!
//     name: String!
//     createdAt: String!
//     updatedAt: String!
//     users: [User!]
//   }

//   type User {
//     id: ID!
//     firstName: String!
//     lastName: String!
//     email: String!
//     isActive: Boolean!
//     role: Role!
//     jobTitle: String
//     department: Department
//     organization: Organization
//     deleteFlag: Boolean!
//     createdAt: String!
//     updatedAt: String!
//     projectsLed: [Project!]
//     createdTickets: [Ticket!]
//     assignedTickets: [TicketData!]
//     reportedTickets: [TicketData!]
//   }

//   type ProjectCategory {
//     id: ID!
//     name: String!
//     description: String
//     deleteFlag: Boolean!
//     createdAt: String!
//     updatedAt: String!
//     projects: [Project!]
//   }

//   type Project {
//     id: ID!
//     name: String!
//     projectKey: String!
//     icon: String
//     projectCategory: ProjectCategory!
//     projectLead: User!
//     deleteFlag: Boolean!
//     createdAt: String!
//     updatedAt: String!
//     tickets: [Ticket!]
//     sprints: [Sprint!]
//     backlogItems: [Backlog!]
//   }

//   type BoardStatus {
//     id: ID!
//     name: String!
//     statusCategory: StatusCategory!
//     deleteFlag: Boolean!
//     createdAt: String!
//     updatedAt: String!
//     tickets: [Ticket!]
//   }

//   type Ticket {
//     id: ID!
//     ticketKey: String!
//     project: Project!
//     workType: WorkType!
//     parent: Ticket
//     children: [Ticket!]
//     summary: String!
//     description: String
//     status: BoardStatus!
//     createdBy: User!
//     deleteFlag: Boolean!
//     createdAt: String!
//     updatedAt: String!
//     ticketData: TicketData
//     backlogItem: Backlog
//   }

//   type TicketData {
//     id: ID!
//     ticket: Ticket!
//     priority: Priority!
//     dueDate: String
//     assignee: User
//     reporter: User
//     estimatePoints: Int
//     sprint: Sprint
//     labels: [TicketLabel!]
//   }

//   type Sprint {
//     id: ID!
//     name: String!
//     goal: String
//     project: Project!
//     startDate: String!
//     endDate: String!
//     status: SprintStatus!
//     createdAt: String!
//     updatedAt: String!
//     tickets: [TicketData!]
//     backlog: [Backlog!]
//   }

//   type Backlog {
//     id: ID!
//     ticket: Ticket!
//     project: Project!
//     sprint: Sprint
//     position: Int!
//     createdAt: String!
//   }

//   type TicketLabel {
//     id: ID!
//     name: String!
//     tickets: [TicketData!]
//   }

//   type Query {
//     users: [User!]
//     user(id: ID!): User
//     projects: [Project!]
//     project(id: ID!): Project
//     tickets: [Ticket!]
//     ticket(id: ID!): Ticket
//     sprints: [Sprint!]
//     backlogItems: [Backlog!]
//   }

// `;

import { gql } from "apollo-server";

export const typeDefs = gql`
  scalar BigInt
  scalar DateTime
  type MutationResponse {
    status: Boolean!
    message: String!
    timestamp: String!
  }
  enum Role {
    ADMIN
    PROJECT_MANAGER
    DEVELOPER
    QA
    REPORTER
  }

  enum StatusCategory {
    TODO
    IN_PROGRESS
    DONE
  }

  enum WorkType {
    EPIC
    FEATURE
    BUG
    STORY
    TASK
    SUBTASK
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  enum SprintStatus {
    FUTURE
    ACTIVE
    COMPLETED
  }

  type User {
    id: BigInt!
    firstName: String!
    lastName: String!
    email: String!
    isActive: Boolean!
    role: Role!
    jobTitle: String
    departmentId: BigInt
    organizationId: BigInt
    deleteFlag: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Department {
    id: BigInt!
    name: String!
    created_at: DateTime!
    updated_at: DateTime!
    users: [User!]!
  }

  type Organization {
    id: BigInt!
    name: String!
    created_at: DateTime!
    updated_at: DateTime!
    users: [User!]!
  }

  type Project {
    id: ID!
    name: String!
    project_key: String!
    icon: String
    project_category: ProjectCategory!
    project_category_id: ID!
    project_lead: User!
    project_lead_id: ID!
    delete_flag: Boolean!
    created_at: String!
    updated_at: String!

    tickets: [Ticket!]!
    sprints: [Sprint!]!
    backlogItems: [Backlog!]!
  }

  type ProjectCategory {
    id: ID!
    name: String!
    description: String
    delete_flag: Boolean!
    created_at: String!
    updated_at: String!

    projects: [Project!]!
  }

  type BoardStatus {
    id: ID!
    name: String!
    status_category: StatusCategory!
    delete_flag: Boolean!
    created_at: String!
    updated_at: String!

    tickets: [Ticket!]!
  }

  type Ticket {
    id: ID!
    ticket_key: String!
    project: Project!
    project_id: ID!
    work_type: WorkType!
    parent: Ticket
    parent_id: ID
    children: [Ticket!]!
    summary: String!
    description: String
    status: BoardStatus!
    status_id: ID!
    created_by: User!
    created_by_id: ID!
    delete_flag: Boolean!
    created_at: String!
    updated_at: String!

    ticketData: TicketData
    backlogItem: Backlog
  }

  type TicketData {
    id: ID!
    ticket: Ticket!
    ticket_id: ID!
    priority: Priority!
    due_date: String
    assignee: User
    assignee_id: ID
    reporter: User
    reporter_id: ID
    estimate_points: Int
    sprint: Sprint
    sprint_id: ID
    labels: [TicketLabel!]!
  }

  type TicketLabel {
    id: ID!
    name: String!
    tickets: [TicketData!]!
  }

  type Sprint {
    id: ID!
    name: String!
    goal: String
    project: Project!
    project_id: ID!
    start_date: String!
    end_date: String!
    status: SprintStatus!
    created_at: String!
    updated_at: String!

    tickets: [TicketData!]!
    backlog: [Backlog!]!
  }

  type Backlog {
    id: ID!
    ticket: Ticket!
    ticket_id: ID!
    project: Project!
    project_id: ID!
    sprint: Sprint
    sprint_id: ID
    position: Int!
    created_at: String!
  }

  type Query {
    users: [User!]!
    user(id: BigInt!): User

    departments: [Department!]!
    department(id: BigInt!): Department

    organizations: [Organization!]!
    organization(id: BigInt!): Organization

    projects: [Project!]!
    project(id: ID!): Project

    tickets: [Ticket!]!
    ticket(id: ID!): Ticket
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      role: Role!
      jobTitle: String
      departmentId: BigInt
      organizationId: BigInt
    ): User!

    updateUser(
      id: BigInt!
      firstName: String
      lastName: String
      email: String
      role: Role
      jobTitle: String
      departmentId: BigInt
      organizationId: BigInt
      isActive: Boolean
      deleteFlag: Boolean
    ): User!

    deleteUser(id: BigInt!): Boolean!

    createDepartment(name: String!): MutationResponse!
    updateDepartment(id: BigInt!, name: String!): Department!

    createOrganization(name: String!): MutationResponse!
    updateOrganization(id: BigInt!, name: String!): Organization!

    createProject(
      name: String!
      projectKey: String!
      icon: String
      projectCategoryId: ID!
      projectLeadId: ID!
    ): MutationResponse!
  }
`;
