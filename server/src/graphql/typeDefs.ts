//this file defines the shape of GraphQL types
import { gql } from "apollo-server-express";

export const typeDefs = gql`
  input LogInInput {
    code: String!
  }

  type NASAImages {
    total: Int!
    result: [NASAImage!]!
  }

  type Comments {
    total: Int!
    result: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    avatar: String!
    contact: String!
    likedNASAImages(limit: Int!, page: Int!): NASAImages!
    comments(limit: Int!, page: Int!): Comments!
  }

  type Viewer {
    id: ID
    token: String
    avatar: String
    name: String
    didRequest: Boolean!
    likedNASAImages: [NASAImage!]
    comments: [Comment!]
  }

  type Comment {
    id: ID!
    user: String!
    likes: Int!
    timestamp: String!
    text: String!
    usersWhoFlagged: [User!]
  }

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
    user: String!
  }

  type Mutation {
    like(id: ID!): NASAImage
    unlike(id: ID!): NASAImage
    postComment(id: ID!, comment: String): NASAImage
    addNASAImage(dateToGet: String): String
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`;
