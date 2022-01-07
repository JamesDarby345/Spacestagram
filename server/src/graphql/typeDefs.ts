import { gql } from "apollo-server-express";

export const typeDefs = gql`
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
  }

  type Mutation {
    like(id: ID!): Int
    unlike(id: ID!): Int
  }
`;