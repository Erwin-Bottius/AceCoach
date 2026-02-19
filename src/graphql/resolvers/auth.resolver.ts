import { login, refreshTheToken, signup } from "../../services/auth.service";
import { signupSchema, type LoginInput, type SignupInput } from "../../inputSchemas/auth.schema";

const authResolvers = {
  Mutation: {
    signup: async (_: any, args: SignupInput) => {
      const zodValidation = signupSchema.safeParse(args);
      if (!zodValidation.success) {
        const errorMessages = zodValidation.error!.issues;
        throw new Error(errorMessages.map((issue) => issue.message).join("."));
      }
      return signup(args);
    },
    login: async (_parent: any, args: LoginInput) => {
      const { token, refreshToken, user } = await login(args);

      return { user, token, refreshToken };
    },
    refreshTheToken: async (_parent: any, args: { refreshToken: string }) => {
      const { token, refreshToken, user } = await refreshTheToken(args.refreshToken);

      return { user, token, refreshToken };
    },
  },
};

export default authResolvers;
