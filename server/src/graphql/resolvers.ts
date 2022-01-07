import { IResolvers } from "@graphql-tools/utils";
import { NASAImages } from "../NASAImages";

export const resolvers: IResolvers = {
  Query: {
    NASAImages: () => {
      return NASAImages;
    }
  },
  Mutation: {
    like: (_root: undefined, { id }: { id: number }) => {
      for (let i = 0; i < NASAImages.length; i++){
        if (NASAImages[i].id == id) {
          NASAImages[i].likes = NASAImages[i].likes + 1
          return NASAImages[i].likes
        }
      }

      throw new Error("failed to add like");
    },
    unlike: (_root: undefined, { id }: { id: number }) => {
      for (let i = 0; i < NASAImages.length; i++){
        if (NASAImages[i].id == id) {
          NASAImages[i].likes = NASAImages[i].likes - 1
          return NASAImages[i].likes
        }
      }

      throw new Error("failed to unlike");
    }
  }
};