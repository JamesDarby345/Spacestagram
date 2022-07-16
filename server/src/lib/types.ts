// This file defines Typescript types for the database.
import { Collection, ObjectId } from "mongodb";

export interface Viewer {
  _id?: string;
  token?: string;
  avatar?: string;
  name?: string;
  didRequest: boolean;
}
export interface NASAImage {
  _id: ObjectId;
  likes: number;
  copyright?: string;
  date: string;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  comments?: ObjectId[];
}

export interface Comment {
  id: ObjectId;
  userId: string;
  userAvatar: string;
  userName: string;
  likes: number;
  timestamp: string;
  text: string;
  usersWhoFlagged: string[];
}
export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  contact: string;
  likedNASAImages: ObjectId[];
  comments: ObjectId[];
}

export interface Database {
  NASAImages: Collection<NASAImage>;
  users: Collection<User>;
  comments: Collection<Comment>;
}
