import { Collection, ObjectId } from "mongodb";

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
  comments: ObjectId[];
}

export interface Comment {
  _id: ObjectId;
  user: string;
  likes: number;
  timestamp: string;
  text: string;
}
export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
}

export interface Database {
  NASAImages: Collection<NASAImage>;
  users: Collection<User>;
  comments: Collection<Comment>;
}
