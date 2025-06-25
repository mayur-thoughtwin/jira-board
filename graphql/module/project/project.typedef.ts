import { gql } from "apollo-server";

export const projectTypeDefs = gql`
  scalar BigInt
  scalar DateTime

  type Project {
    id: BigInt!
    name: String!
    project_key: String!
    icon: String
    project_category: ProjectCategory!
    project_category_id: BigInt!
    project_lead: User!
    project_lead_id: BigInt!
    delete_flag: Boolean!
    created_at: DateTime!
    updated_at: DateTime!
    tickets: [Ticket!]!
    sprints: [Sprint!]!
    backlogItems: [Backlog!]!
  }

  input CreateProjectInput {
    name: String!
    project_key: String!
    icon: String
    project_category_id: BigInt!
    project_lead_id: BigInt!
  }

  input UpdateProjectInput {
    id: BigInt!
    name: String
    project_key: String
    icon: String
    project_category_id: BigInt
    project_lead_id: BigInt
    delete_flag: Boolean
  }

  type Query {
    projects: [Project!]!
    project(id: BigInt!): Project
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(input: UpdateProjectInput!): Project!
    deleteProject(id: BigInt!): MutationResponse!
  }

  type MutationResponse {
    status: Boolean!
    message: String!
    timestamp: String!
  }
`;
