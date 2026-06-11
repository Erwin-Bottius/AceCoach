import { GraphQLScalarType, Kind } from "graphql";
import classResolvers from "./class.resolver";
import userResolvers from "./user.resolver";
import authResolvers from "./auth.resolver";

const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  serialize(value) {
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "string") return value;
    throw new Error("DateTime must be a Date or ISO string");
  },
  parseValue(value) {
    if (typeof value === "string") return new Date(value);
    throw new Error("DateTime input must be an ISO string");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    throw new Error("DateTime literal must be a string");
  },
});

const scalarResolvers = { DateTime: DateTimeScalar };

const resolvers = [scalarResolvers, userResolvers, classResolvers, authResolvers];

export default resolvers;
