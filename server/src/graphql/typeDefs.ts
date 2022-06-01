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
    comments: [ID]
  }

  type Query {
    NASAImages: [NASAImage!]!
    NASAImage(date: String): NASAImage
    authUrl: String!
  }

  type Mutation {
    like(id: ID!): NASAImage
    unlike(id: ID!): NASAImage
    postComment(id: ID!, comment: String): NASAImage
    addNASAImage(dateToGet: String): String
    logIn: String!
    logOut: String!
  }
`;
