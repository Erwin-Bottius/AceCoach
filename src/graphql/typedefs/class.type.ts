import { gql } from "graphql-tag";

const classTypeDefs = gql`
  input CreateClassInput {
    name: String!
    theme: String!
    date: DateTime!
    duration: Int!
    capacity: Int
    level: String
    location: String
    price: Int
    isPublished: Boolean
    teacherID: ID
  }

  type Class {
    id: ID!
    name: String!
    theme: String!
    date: DateTime!
    duration: Int!
    capacity: Int
    level: String
    location: String
    price: Int
    isPublished: Boolean
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
      date: DateTime!
      duration: Int!
      capacity: Int
      teacherID: ID!
      level: String
      location: String
      price: Int
      isPublished: Boolean
    ): Class!

    createManyClasses(inputs: [CreateClassInput!]!): [Class!]!

    updateClass(
      id: ID!
      name: String
      theme: String
      date: DateTime
      duration: Int
      capacity: Int
      level: String
      location: String
      price: Int
      isPublished: Boolean
      teacherID: ID
      students: [ID!]
    ): Class!

    joinClass(classID: ID!): Class!

    leaveClass(classID: ID!): Class!

    deleteClass(id: ID!): Class!
  }
`;

export default classTypeDefs;
