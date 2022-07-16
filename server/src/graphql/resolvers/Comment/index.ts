import { IResolvers } from "@graphql-tools/utils";
import { Database } from "../../../lib/types";
import { ObjectId } from "mongodb";
import { CommentsArgs, CommentsData } from "./types";

export const commentResolvers: IResolvers = {
  Query: {
    NASAImageComments: async (
      _root: undefined,
      { userId, limit, page, date, filter }: CommentsArgs,
      { db }: { db: Database }
    ): Promise<CommentsData> => {
      try {
        const queiredNASAImage = await db.NASAImages.findOne({
          date: date,
        });

        if (!userId) {
          userId = "";
        }

        if (!queiredNASAImage) {
          throw new Error(
            "failed to find necessary information for NASAImageComments"
          );
        }

        let comments = [];
        if (filter == "LATEST_COMMENTS") {
          comments = await db.comments
            .find({
              _id: { $in: queiredNASAImage.comments },
              usersWhoFlagged: { $not: { $elemMatch: { $eq: userId } } },
            })
            .sort({ timestamp: -1 })
            .skip(page * limit)
            .limit(limit)
            .toArray();
        } else if (filter == "OLDEST_COMMENTS") {
          comments = await db.comments
            .find({
              _id: { $in: queiredNASAImage.comments },
              usersWhoFlagged: { $not: { $elemMatch: { $eq: userId } } },
            })
            .sort({ timestamp: 1 })
            .skip(page * limit)
            .limit(limit)
            .toArray();
        } else if (filter == "MOST_LIKED") {
          comments = await db.comments
            .find({
              _id: { $in: queiredNASAImage.comments },
              usersWhoFlagged: { $not: { $elemMatch: { $eq: userId } } },
            })
            .sort({ likes: -1 })
            .skip(page * limit)
            .limit(limit)
            .toArray();
        } else if (filter == "SAFE_COMMENTS") {
          comments = await db.comments
            .find({
              _id: { $in: queiredNASAImage.comments },
              usersWhoFlagged: { $size: 0 },
            })
            .sort({ likes: -1 })
            .skip(page * limit)
            .limit(limit)
            .toArray();
        } else {
          comments = await db.comments
            .find({
              _id: { $in: queiredNASAImage.comments },
            })
            .toArray();
        }
        console.log(comments);
        const total = queiredNASAImage.comments
          ? queiredNASAImage.comments.length
          : 0;
        return { total, result: comments };
      } catch (error) {
        throw new Error(`Failed to query comments: ${error}`);
      }
    },
  },
  Mutation: {
    flagComment: async (
      _root: undefined,
      { commentId, userId }: { commentId: string; userId: string },
      { db }: { db: Database }
    ): Promise<boolean> => {
      try {
        const comment_id = new ObjectId(commentId);
        const queiredComment = await db.comments.findOne({
          _id: comment_id,
        });
        queiredComment?.usersWhoFlagged.push(userId);
        await db.comments.updateOne(
          { _id: comment_id },
          { $set: { usersWhoFlagged: queiredComment?.usersWhoFlagged } }
        );
        return true;
      } catch (error) {
        throw new Error(`Failed to flag comment: ${error}`);
      }
    },
  },
};
