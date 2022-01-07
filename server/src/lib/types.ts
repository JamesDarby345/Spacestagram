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
}


export interface Database {
  NASAImages: Collection<NASAImage>;
}