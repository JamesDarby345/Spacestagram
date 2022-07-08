//this file defines the shape of GraphQL types
import { gql } from "apollo-server-express";

// type NASAImages {
//   total: Int
//   result: [NASAImage]
// }

//likedNASAImages(limit: Int!, page: Int!): NASAImages!

//comments(limit: Int!, page: Int!): Comments!

export const typeDefs = gql`
  input LogInInput {
    code: String!
  }

  enum CommentsFilter {
    ALL
    LATEST_COMMENTS
    OLDEST_COMMENTS
    MOST_LIKED
  }

  type Comments {
    total: Int!
    result: [Comment!]!
  }

  type User {
    id: String!
    name: String!
    avatar: String!
    contact: String!
    likedNASAImages: [NASAImage!]
    comments: [ID!]
  }

  type Viewer {
    id: String!
    token: String
    avatar: String
    name: String!
    didRequest: Boolean!
    likedNASAImages: [NASAImage!]
    comments: [ID!]
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
    NASAImageLikedByUser(date: String!, userId: String!): Boolean
    NASAImageComments(
      limit: Int!
      page: Int!
      date: String!
      filter: CommentsFilter!
    ): Comments!
  }

  type Mutation {
    like(id: ID!, userId: String!): NASAImage
    unlike(id: ID!, userId: String!): NASAImage
    postCommentNASAImage(
      id: ID!
      userId: String!
      commentText: String!
    ): NASAImage
    addNASAImage(dateToGet: String): String
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`;
