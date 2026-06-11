import { gql } from "graphql-tag";
const baseTypeDefs = gql`
  scalar DateTime

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export default baseTypeDefs;
