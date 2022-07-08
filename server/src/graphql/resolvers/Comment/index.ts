import { IResolvers } from "@graphql-tools/utils";
import { Database } from "../../../lib/types";
import { CommentsArgs, CommentsData } from "./types";

export const commentResolvers: IResolvers = {
  Query: {
    NASAImageComments: async (
      _root: undefined,
      { limit, page, date, filter }: CommentsArgs,
      { db }: { db: Database }
    ): Promise<CommentsData> => {
      try {
        const queiredNASAImage = await db.NASAImages.findOne({
          date: date,
        });

        if (!queiredNASAImage) {
          throw new Error(
            "failed to find necessary information for NASAImageComments"
          );
        }

        let comments: any;
        switch (filter) {
          case "ALL":
            comments = await db.comments
              .find({
                nasaImageId: queiredNASAImage._id,
              })
              .toArray();
            break;
          case "LATEST_COMMENTS":
            comments = await db.comments
              .find({
                nasaImageId: queiredNASAImage._id,
              })
              .sort({ timestamp: -1 })
              .toArray();
            break;
          case "OLDEST_COMMENTS":
            comments = await db.comments
              .find({
                nasaImageId: queiredNASAImage._id,
              })
              .sort({ timestamp: 1 })
              .toArray();
            break;
          case "MOST_LIKED":
            comments = await db.comments
              .find({
                nasaImageId: queiredNASAImage._id,
              })
              .sort({ likes: -1 })
              .toArray();
            break;
          default:
            throw new Error("invalid filter");
        }

        const total = comments.length;
        const result = comments.slice(page * limit, (page + 1) * limit);

        return { total, result };
      } catch (error) {
        throw new Error(`Failed to query comments: ${error}`);
      }
    },
  },
};
