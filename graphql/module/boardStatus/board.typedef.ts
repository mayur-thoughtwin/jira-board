// schema/typeDefs/boardStatus.ts
import gql from "graphql-tag";

export const boardStatusTypeDefs = gql`
  enum StatusCategory {
    TODO
    IN_PROGRESS
    DONE
  }

  type BoardStatus {
    id: BigInt!
    name: String!
    status_category: StatusCategory!
    delete_flag: Boolean!
    created_at: String!
    updated_at: String!
    tickets: [Ticket!]!
  }

  type MutationResponse {
    status: Boolean!
    message: String!
    timestamp: String!
  }

  type BoardStatusListResponse {
    status: Boolean!
    message: String!
    data: [BoardStatus!]!
  }
  type BoardStatusResponse {
    status: Boolean!
    message: String!
    data: BoardStatus
  }

  type Query {
    boardStatuses: BoardStatusListResponse!
    boardStatus(id: ID!): BoardStatusResponse!
  }

  type Mutation {
    createBoardStatus(name: String!, status_category: StatusCategory!): MutationResponse!

    updateBoardStatus(id: ID!, name: String, status_category: StatusCategory): MutationResponse!

    deleteBoardStatus(id: ID!): MutationResponse!
  }
`;
