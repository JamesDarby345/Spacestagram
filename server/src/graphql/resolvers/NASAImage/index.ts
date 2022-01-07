import { IResolvers } from "@graphql-tools/utils";
import { Database, NASAImage } from "../../../lib/types";
import { ObjectId } from "mongodb";

export const NASAImageResolvers: IResolvers = {
  Query: {
    NASAImages: async (
      _root: undefined, 
      _args: undefined, 
      { db }:{ db: Database }
    ): Promise<NASAImage[]> => {
      return await db.NASAImages.find({}).toArray();
    }
  },
  Mutation: {
    like: async (
      _root: undefined, 
      { id }: { id: string },
      { db }:{ db: Database }
      ) => {
        const likedNASAImage = await db.NASAImages.findOne({
          _id: new ObjectId(id),
        })

        if (!likedNASAImage) {
          throw new Error('failed to like listing');
        }
        
        likedNASAImage.likes = likedNASAImage.likes + 1;
        db.NASAImages.updateOne({ _id : new ObjectId(id) },{ $set: { likes : (likedNASAImage.likes) }})
        return likedNASAImage;
    },
    unlike: async (
      _root: undefined, 
      { id }: { id: string },
      { db }:{ db: Database }
      ) => {
        const unlikedNASAImage = await db.NASAImages.findOne({
          _id: new ObjectId(id),
        })

        if (!unlikedNASAImage) {
          throw new Error('failed to unlike listing');
        }

        unlikedNASAImage.likes = unlikedNASAImage.likes - 1;
        db.NASAImages.updateOne({ _id : new ObjectId(id) },{ $set: { likes : (unlikedNASAImage.likes) }})
        return unlikedNASAImage;
    }
  },
  NASAImage: {
    id: (nasa_image: NASAImage): string => nasa_image._id.toString()
  }
};