import express, { Application } from "express";
import { connectDatabase } from "./database";
import compression from "compression";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./graphql";
import { resolvers } from "./graphql/resolvers";

const mount = async (app: Application) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
  });
  const db = await connectDatabase();

  server.start().then(() => {
    app.use(compression());
    app.use(express.static(`${__dirname}/client`));
    app.get("/*", (_req, res) =>
      res.sendFile(`${__dirname}/client/index.html`)
    );

    server.applyMiddleware({ app, path: "/api" });
    app.listen(process.env.PORT);
    console.log(`[app] : http://localhost:${process.env.PORT}`);
  });
};

mount(express());
