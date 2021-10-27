const { createServer } = require("http");
const { readFileSync } = require("fs");
const { ApolloServer, PubSub } = require("apollo-server-express");
const express = require("express");
const expressPlayground =
  require("graphql-playground-middleware-express").default;
const { MongoClient } = require("mongodb");
require("dotenv").config();

const resolvers = require("./resolvers");

const typeDefs = readFileSync("./typeDefs.graphql", "utf8");

async function start() {
  const MONDO_DB = process.env.DB_HOST;
  const client = await MongoClient.connect(MONDO_DB, { useNewUrlParser: true });
  const db = client.db();

  const app = express();
  app.use(express.static('public'))

  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }) => {
      const githubToken = req
        ? req.headers.authorization
        : connection.context.Authorization;
      const currentUser = await db.collection("users").findOne({ githubToken });
      return { db, currentUser, pubsub };
    },
  });

  server.applyMiddleware({ app });
  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  app.get("/", (req, res) => {
    return res.end("Welcome to the PhotoShare API");
  });

  // playgroundを利用するために設定
  // /graphqlがgraphqlのデフォルトのエンドポイントっぽい。
  // /graphqlにブラウザでアクセスしてもplaygroundと同じ画面にみえる。playground必要なのかしら。
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  httpServer.listen({ port: 4000 }, () => {
    console.log(`GraphGL server running on ${server.graphqlPath}`);
  });
}

start();
