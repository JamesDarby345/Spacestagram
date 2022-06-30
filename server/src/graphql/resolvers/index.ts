import merge from "lodash.merge";
import { NASAImageResolvers } from "./NASAImage";
import { viewerResolvers } from "./Viewer";
import { userResolvers } from "./User";

export const resolvers = merge(
  NASAImageResolvers,
  viewerResolvers,
  userResolvers
);
