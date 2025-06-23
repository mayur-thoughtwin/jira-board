export const typeDefs = /* GraphQL */ `
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

  type Department {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    users: [User!]
  }

  type Organization {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
    users: [User!]
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    isActive: Boolean!
    role: Role!
    jobTitle: String
    department: Department
    organization: Organization
    deleteFlag: Boolean!
    createdAt: String!
    updatedAt: String!
    projectsLed: [Project!]
    createdTickets: [Ticket!]
    assignedTickets: [TicketData!]
    reportedTickets: [TicketData!]
  }

  type ProjectCategory {
    id: ID!
    name: String!
    description: String
    deleteFlag: Boolean!
    createdAt: String!
    updatedAt: String!
    projects: [Project!]
  }

  type Project {
    id: ID!
    name: String!
    projectKey: String!
    icon: String
    projectCategory: ProjectCategory!
    projectLead: User!
    deleteFlag: Boolean!
    createdAt: String!
    updatedAt: String!
    tickets: [Ticket!]
    sprints: [Sprint!]
    backlogItems: [Backlog!]
  }

  type BoardStatus {
    id: ID!
    name: String!
    statusCategory: StatusCategory!
    deleteFlag: Boolean!
    createdAt: String!
    updatedAt: String!
    tickets: [Ticket!]
  }

  type Ticket {
    id: ID!
    ticketKey: String!
    project: Project!
    workType: WorkType!
    parent: Ticket
    children: [Ticket!]
    summary: String!
    description: String
    status: BoardStatus!
    createdBy: User!
    deleteFlag: Boolean!
    createdAt: String!
    updatedAt: String!
    ticketData: TicketData
    backlogItem: Backlog
  }

  type TicketData {
    id: ID!
    ticket: Ticket!
    priority: Priority!
    dueDate: String
    assignee: User
    reporter: User
    estimatePoints: Int
    sprint: Sprint
    labels: [TicketLabel!]
  }

  type Sprint {
    id: ID!
    name: String!
    goal: String
    project: Project!
    startDate: String!
    endDate: String!
    status: SprintStatus!
    createdAt: String!
    updatedAt: String!
    tickets: [TicketData!]
    backlog: [Backlog!]
  }

  type Backlog {
    id: ID!
    ticket: Ticket!
    project: Project!
    sprint: Sprint
    position: Int!
    createdAt: String!
  }

  type TicketLabel {
    id: ID!
    name: String!
    tickets: [TicketData!]
  }

  type Query {
    users: [User!]
    user(id: ID!): User
    projects: [Project!]
    project(id: ID!): Project
    tickets: [Ticket!]
    ticket(id: ID!): Ticket
    sprints: [Sprint!]
    backlogItems: [Backlog!]
  }
  
`;
