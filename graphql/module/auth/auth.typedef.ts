import { gql } from "apollo-server";

export const authTypeDefs = gql`
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
  type User {
    id: BigInt!
    firstName: String!
    lastName: String!
    email: String!
    isActive: Boolean!
    role: Role!
    jobTitle: String
    department: String
    organization: String
    deleteFlag: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type Query {
    users: [User!]!
    user(id: BigInt!): User
  }
  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
      role: Role!
      jobTitle: String
      department: String
      organization: String
    ): User!

    login(email: String!, password: String!): String!
  }
`;
