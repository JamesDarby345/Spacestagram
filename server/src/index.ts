import express, { Application } from "express";
import { connectDatabase } from "./database";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";

const app = express();
const port = 9000;

const server = new ApolloServer({ typeDefs, resolvers });

const mount = (app: Application) => {
  const db = await connectDatabase();
  server.start().then(() => { 
    server.applyMiddleware({ app, path: "/api" });
    // app.use(express.json())
    app.listen(port);
    console.log(`[app] : http://localhost:${port}`);
  });

}

mount(express());