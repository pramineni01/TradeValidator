import express from "express";
import dotenv from "dotenv";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { createServer } from "http";
import compression from "compression";
import * as _ from "lodash";
// import { authorize } from "./helpers/auth";

import * as tradeVal from "./resolvers/trade_validator_schema";

dotenv.config();
const { PORT } = process.env;

const schema = makeExecutableSchema({
  typeDefs: tradeVal.typeDef,
  resolvers: _.merge(tradeVal.resolvers),
});

const app = express();
const server = new ApolloServer({
  schema,
  // context: authorize,
  introspection: true,
  playground: true,
});
app.use(compression());
server.applyMiddleware({ app, path: "/graphql" });
const httpServer = createServer(app);
httpServer.listen({ port: PORT }, (): void =>
  console.log(`\n 🚀 GraphQL is now running on http://localhost:3000/graphql`)
);
