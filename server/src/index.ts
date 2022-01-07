import express, { Application } from "express";
import { connectDatabase } from "./database";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql";
import { resolvers } from "./graphql/resolvers";

const mount = async (app: Application) => {
  const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context: () => ({ db }) 
  });
  const db = await connectDatabase();

  server.start().then(() => {
    server.applyMiddleware({ app, path: "/api" });
    app.listen(process.env.PORT);
    console.log(`[app] : http://localhost:${process.env.PORT}`);
  });

  // const a = await db.NASAImages.find({}).toArray();
  // console.log(a);
}

mount(express());