import merge from "lodash.merge";
import { NASAImageResolvers } from "./NASAImage";
import { viewerResolvers } from "./Viewer";

export const resolvers = merge(NASAImageResolvers, viewerResolvers);
