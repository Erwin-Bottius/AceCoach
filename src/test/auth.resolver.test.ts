import { prisma } from "../test/setup";
import authResolvers from "../graphql/resolvers/auth.resolver";
import type { SignupInput } from "../inputSchemas/auth.schema";

describe("Auth Resolvers", () => {
  // =============================================
  // 1. Tests for signup
  // =============================================
  describe("signup", () => {
    it("✅ should create a user with valid input", async () => {
      const args: SignupInput = {
        email: "user1@test.com",
        password: "Password123!",
        firstName: "John",
        lastName: "Doe",
        role: "STUDENT",
      };

      const result = await authResolvers.Mutation.signup(null, args);

      expect(result.user.email).toBe(args.email);
      expect(result.user.role).toBe("STUDENT");
      expect(result.user.password).not.toBe(args.password);
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("❌ should throw if email already exists", async () => {
      const args: SignupInput = {
        email: "duplicate@test.com",
        password: "Password123!",
        firstName: "Jane",
        lastName: "Doe",
        role: "STUDENT",
      };

      await authResolvers.Mutation.signup(null, args);

      await expect(authResolvers.Mutation.signup(null, args)).rejects.toThrow(
        "Email already in use",
      );
    });

    it("❌ should throw validation error for invalid input", async () => {
      const invalidArgs = {
        email: "invalid-email",
        password: "123",
        firstName: "",
        lastName: "",
        role: "STUDENT",
      };

      await expect(authResolvers.Mutation.signup(null, invalidArgs as any)).rejects.toThrow();
    });
  });

  // =============================================
  // 2. Tests for login
  // =============================================
  describe("login", () => {
    it("❌ should throw if email does not exist", async () => {
      await expect(
        authResolvers.Mutation.login(null, {
          email: "unknown@test.com",
          password: "Password123!",
        }),
      ).rejects.toThrow("email or password invalid");
    });

    it("❌ should throw if password is incorrect", async () => {
      const email = "login@test.com";
      const password = "wrongPassword";

      await expect(
        authResolvers.Mutation.login(null, {
          email,
          password: "WrongPassword!",
        }),
      ).rejects.toThrow("email or password invalid");
    });
    it("✅ should login with correct credentials", async () => {
      const email = "login@test.com";
      const password = "Password123!";

      await authResolvers.Mutation.signup(null, {
        email,
        password,
        firstName: "Login",
        lastName: "User",
        role: "TEACHER",
      });

      const result = await authResolvers.Mutation.login(null, { email, password });

      expect(result.user.email).toBe(email);
      expect(result.token).toBeDefined();
      expect(result.user.password).not.toBe(password);
    });
  });
});
