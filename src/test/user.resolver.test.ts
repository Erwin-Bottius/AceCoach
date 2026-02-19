import { prisma } from "./setup";
import userResolver from "../graphql/resolvers/user.resolver";
import { GraphQLResolveInfo } from "graphql";
import type { Request, Response } from "express";
import { User } from "../types/user";

describe("User Resolvers", () => {
  const prepareCreateUser = async () => {
    const user = await prisma.user.create({
      data: {
        email: "userResolverTest@test.com",
        password: "Password123!",
        firstName: "User",
        lastName: "Resolver",
        role: "STUDENT",
      },
    });
    return user;
  };

  it("✅ update", async () => {
    const user = await prepareCreateUser();
    const context = { user, req: {} as Request, res: {} as Response, error: null };

    const updatedUser = (await userResolver.Mutation.updateUser(
      null,
      {
        email: "updatedUser@test.com",
      },
      context,
      {} as GraphQLResolveInfo,
    )) as User;
    expect(updatedUser.email).toBe("updatedUser@test.com");
  });
});
