import "dotenv/config";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import typeDefs from "./graphql/typedefs";
import resolvers from "./graphql/resolvers";
import { connectToDB, disconnectFromDB } from "./config/db";
import { createContext } from "./graphql/context";

const PORT = process.env.PORT || 3000;

async function startServer() {
  // 1️⃣ Connexion à la DB
  await connectToDB();

  // 2️⃣ Création de l'app Express
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 4️⃣ Création et démarrage du serveur Apollo
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start(); // async, d’où la fonction enveloppante

  // 5️⃣ Middleware Apollo
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: createContext,
    }),
  );

  // 6️⃣ Démarrage du serveur HTTP Express
  const httpServer = app.listen(PORT, () => {});

  // 7️⃣ Graceful shutdown
  const shutdown = async () => {
    httpServer.close(async () => {
      await disconnectFromDB();

      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  // 8️⃣ Gestion des erreurs non catchées
  process.on("unhandledRejection", async (err) => {
    console.error("Unhandled rejection:", err);
    await disconnectFromDB();
    process.exit(1);
  });

  process.on("uncaughtException", async (err) => {
    console.error("Uncaught exception:", err);
    await disconnectFromDB();
    process.exit(1);
  });

  return httpServer;
}

// Démarrage du serveur
startServer().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
