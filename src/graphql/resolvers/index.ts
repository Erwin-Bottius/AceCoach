import classResolvers from "./class.resolver";
import userResolvers from "./user.resolver";
import authResolvers from "./auth.resolver";

const resolvers = [userResolvers, classResolvers, authResolvers];

export default resolvers;
