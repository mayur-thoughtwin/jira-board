import gql from "graphql-tag";

export const ticketTypeDefs = gql`
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

  type Ticket {
    id: BigInt!
    ticket_key: String!
    project: Project!
    work_type: WorkType!
    parent_id: ID
    summary: String!
    description: String
    status_id: ID!
    created_by_id: ID!
    delete_flag: Boolean!
    created_at: String!
    updated_at: String!

    parent: Ticket
    children: [Ticket!]!
    ticketData: TicketData
    backlogItem: Backlog
  }

  type TicketData {
    id: ID!
    ticket_id: ID!
    priority: Priority!
    due_date: String
    assignee_id: ID
    reporter_id: ID
    estimate_points: Int
    sprint_id: ID
    ticket: Ticket!
    assignee: User
    reporter: User
    sprint: Sprint
    labels: [TicketLabel!]!
  }

  type TicketLabel {
    id: ID!
    name: String!
    tickets: [TicketData!]!
  }

  type MutationResponse {
    status: Boolean!
    message: String!
    timestamp: String!
  }

  type Query {
    tickets: [Ticket!]!
    ticket(id: ID!): Ticket
    ticketLabels: [TicketLabel!]!
  }
  input CreateTicketInput {
    project_id: ID!
    work_type: WorkType!
    summary: String!
    description: String
    status_id: ID!
    parent_id: ID
  }
  type Mutation {
    createTicket(input: CreateTicketInput!): Ticket!

    updateTicket(
      id: ID!
      ticket_key: String
      summary: String
      description: String
      status_id: ID
      work_type: WorkType
      parent_id: ID
      delete_flag: Boolean
    ): MutationResponse!

    deleteTicket(id: ID!): MutationResponse!

    createTicketData(
      ticket_id: ID!
      priority: Priority!
      due_date: String
      assignee_id: ID
      reporter_id: ID
      estimate_points: Int
      sprint_id: ID
      label_ids: [ID!]
    ): TicketData!

    updateTicketData(
      ticket_id: ID!
      priority: Priority
      due_date: String
      assignee_id: ID
      reporter_id: ID
      estimate_points: Int
      sprint_id: ID
      label_ids: [ID!]
    ): MutationResponse!
  }
`;
