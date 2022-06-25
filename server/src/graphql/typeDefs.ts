//this file defines the shape of GraphQL types
import { gql } from "apollo-server-express";

// type NASAImages {
//   total: Int
//   result: [NASAImage]
// }

//likedNASAImages(limit: Int!, page: Int!): NASAImages!

// type Comments {
//   total: Int
//   result: [Comment]
// }

//comments(limit: Int!, page: Int!): Comments!

export const typeDefs = gql`
  input LogInInput {
    code: String!
  }

  type User {
    id: String!
    name: String!
    avatar: String!
    contact: String!
    likedNASAImages: [NASAImage!]
    comments: [Comment!]
  }

  type Viewer {
    id: String!
    token: String
    avatar: String
    name: String!
    didRequest: Boolean!
    likedNASAImages: [NASAImage!]
    comments: [Comment!]
  }

  type Comment {
    id: ID!
    user: User!
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
    user(id: ID!): User!
  }

  type Mutation {
    like(id: ID!, userId: String!): NASAImage
    unlike(id: ID!, userId: String!): NASAImage
    postComment(id: ID!, comment: String): NASAImage
    addNASAImage(dateToGet: String): String
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`;
