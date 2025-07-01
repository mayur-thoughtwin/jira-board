import { gql } from "apollo-server";

export const userCollaboratorTypeDefs = gql`
  type MutationResponse {
    status: Boolean!
    message: String!
    timestamp: String!
  }
  type UserCollaborator {
    id: ID!
    userId: ID!
    collaboratorId: ID!
    role: String!
  }

  extend type Query {
    userCollaborators(userId: ID!): [UserCollaborator!]!
  }

  extend type Mutation {
    addUserCollaborator(projectId: ID!, collaboratorId: ID!): MutationResponse!
    removeUserCollaborator(id: ID!): Boolean!
  }
`;
