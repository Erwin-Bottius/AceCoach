import type { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import type { MyContext } from "../graphql/context";

export const requireAuth = <TSource = any, TArgs = any>(
  resolver: GraphQLFieldResolver<TSource, MyContext, TArgs>,
) => {
  return async (parent: TSource, args: TArgs, context: MyContext, info: GraphQLResolveInfo) => {
    if (!context.user?.id) {
      throw new Error("Unauthorized");
    }
    return resolver(parent, args, context, info);
  };
};
