const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const expressPlayground =
  require("graphql-playground-middleware-express").default;
const { readFileSync } = require("fs");
const resolvers = require("./resolvers");

const typeDefs = readFileSync("./typeDefs.graphql", "utf8");

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.get("/", (req, res) => {
  return res.end("Welcome to the PhotoShare API");
});

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.listen({ port: 4000 }, () => {
  console.log(`GraphGL server running on ${server.graphqlPath}`);
});
