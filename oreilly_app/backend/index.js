const { readFileSync } = require("fs");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const expressPlayground =
  require("graphql-playground-middleware-express").default;
const { MongoClient } = require("mongodb");
require("dotenv").config();

const resolvers = require("./resolvers");

const typeDefs = readFileSync("./typeDefs.graphql", "utf8");

async function start() {
  const MONDO_DB = process.env.DB_HOST
  const client = await MongoClient.connect(MONDO_DB, { useNewUrlParser: true })
  const db = client.db()

  const context = { db }
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });

  server.applyMiddleware({ app });

  app.get("/", (req, res) => {
    return res.end("Welcome to the PhotoShare API");
  });

  // playgroundを利用するために設定
  // /graphqlがgraphqlのデフォルトのエンドポイントっぽい。
  // /graphqlにブラウザでアクセスしてもplaygroundと同じ画面にみえる。playground必要なのかしら。
  app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  app.listen({ port: 4000 }, () => {
    console.log(`GraphGL server running on ${server.graphqlPath}`);
  });
}

start();
