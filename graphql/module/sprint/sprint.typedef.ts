import gql from "graphql-tag";

export const sprintTypeDefs = gql`
  enum SprintStatus {
    FUTURE
    ACTIVE
    COMPLETED
  }

  type Sprint {
    id: ID!
    name: String!
    goal: String
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
    ticket_id: ID!
    project_id: ID!
    sprint_id: ID
    position: Int!
    created_at: String!
  }

  type Query {
    sprints: [Sprint!]!
    sprint(id: ID!): Sprint
  }

  type Mutation {
    createSprint(
      name: String!
      goal: String
      project_id: ID!
      start_date: String!
      end_date: String!
      status: SprintStatus!
    ): Sprint!

    updateSprint(
      id: ID!
      name: String
      goal: String
      start_date: String
      end_date: String
      status: SprintStatus
    ): MutationResponse!

    deleteSprint(id: ID!): MutationResponse!
  }
`;
