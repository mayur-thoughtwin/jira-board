import { gql } from "apollo-server";

export const projectCategoryTypeDefs = gql`
  scalar BigInt
  scalar DateTime

  type ProjectCategory {
    id: BigInt!
    name: String!
    description: String
    delete_flag: Boolean!
    created_at: DateTime!
    updated_at: DateTime!
    projects: [Project!]!
  }

  input CreateProjectCategoryInput {
    name: String!
    description: String
  }

  input UpdateProjectCategoryInput {
    id: BigInt!
    name: String
    description: String
    delete_flag: Boolean
  }

  type Query {
    projectCategories: [ProjectCategory!]!
    projectCategory(id: BigInt!): ProjectCategory
  }

  type Mutation {
    createProjectCategory(input: CreateProjectCategoryInput!): ProjectCategory!
    updateProjectCategory(input: UpdateProjectCategoryInput!): ProjectCategory!
    deleteProjectCategory(id: BigInt!): MutationResponse!
  }

  type MutationResponse {
    status: Boolean!
    message: String!
    timestamp: String!
  }
`;
