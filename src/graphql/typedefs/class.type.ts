import { gql } from "graphql-tag";

const classTypeDefs = gql`
  type Class {
    id: ID!
    name: String!
    theme: String!
    date: String!
    duration: Int!
    capacity: Int
    level: String
    teacherID: String
    teacher: User!
    students: [User!]
  }

  extend type Query {
    getAllClasses: [Class!]!
  }

  extend type Mutation {
    createClass(
      name: String!
      theme: String!
      date: String!
      duration: Int!
      capacity: Int
      teacherID: ID!
      level: String
    ): Class!

    updateClass(
      id: ID!
      name: String
      theme: String
      date: String
      duration: Int
      capacity: Int
      level: String
      teacherID: ID
      students: [ID!]
    ): Class!

    deleteClass(id: ID!): Class!
  }
`;

export default classTypeDefs;
