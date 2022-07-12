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

        let comments: any = [];
        if (filter == "ALL") {
          comments = await db.comments
            .find({
              _id: { $in: queiredNASAImage.comments },
            })
            .toArray();
        } else if (filter == "LATEST_COMMENTS") {
          comments = await db.comments
            .find({
              _id: { $in: queiredNASAImage.comments },
            })
            .sort({ timestamp: -1 })
            .skip(page * limit)
            .limit(limit)
            .toArray();
        } else if (filter == "OLDEST_COMMENTS") {
          comments = await db.comments
            .find({
              _id: { $in: queiredNASAImage.comments },
            })
            .sort({ timestamp: 1 })
            .skip(page * limit)
            .limit(limit)
            .toArray();
        } else if (filter == "MOST_LIKED") {
          comments = await db.comments
            .find({
              _id: { $in: queiredNASAImage.comments },
            })
            .sort({ likes: -1 })
            .skip(page * limit)
            .limit(limit)
            .toArray();
        }

        const total = queiredNASAImage.comments
          ? queiredNASAImage.comments.length
          : 0;
        return { total, result: comments };
      } catch (error) {
        throw new Error(`Failed to query comments: ${error}`);
      }
    },
  },
};
