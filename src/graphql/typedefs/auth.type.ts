import { gql } from "graphql-tag";

const authTypeDefs = gql`
  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
  }

  extend type Mutation {
    signup(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      role: Role!
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!
    refreshTheToken(refreshToken: String!): AuthPayload!
  }
`;

export default authTypeDefs;
