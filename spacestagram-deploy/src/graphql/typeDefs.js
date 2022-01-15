"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  type NASAImage {
    id: ID!
    likes: Int
    copyright: String
    date: String!
    explanation: String
    hdurl: String
    media_type: String
    service_version: String
    title: String!
    url: String!
  }

  type Query {
    NASAImages: [NASAImage!]!
    NASAImage(date: String): NASAImage
  }

  type Mutation {
    like(id: ID!): NASAImage
    unlike(id: ID!): NASAImage
    addNASAImage(dateToGet: String): String
  }
`;
