import { gql } from "graphql-tag";

const userTypeDefs = gql`
  enum Role {
    TEACHER
    STUDENT
  }

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    role: Role!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    getAllUsers: [User!]!
    getMe: User
  }
  extend type Mutation {
    updateUser(
      email: String
      firstName: String
      lastName: String
      role: Role
    ): User!
  }
`;

export default userTypeDefs;
