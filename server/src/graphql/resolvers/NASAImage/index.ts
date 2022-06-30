import { IResolvers } from "@graphql-tools/utils";
import { Database, NASAImage } from "../../../lib/types";
import { ObjectId } from "mongodb";
import { arrayBuffer } from "stream/consumers";

const baseUrl = "https://api.nasa.gov/planetary/apod?api_key=";
const apiKey = "mVHFdj3idfIQM8TVfEycg58TSHvoAdTBzGGJfmia";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("node-fetch");

export const NASAImageResolvers: IResolvers = {
  Query: {
    NASAImages: async (
      _root: undefined,
      _args: undefined,
      { db }: { db: Database }
    ): Promise<NASAImage[]> => {
      return await db.NASAImages.find({}).toArray();
    },
    NASAImage: async (
      _root: undefined,
      args: { date: string },
      { db }: { db: Database }
    ): Promise<NASAImage> => {
      const NASAImageToReturn = await db.NASAImages.findOne({
        date: args.date,
      });
      if (!NASAImageToReturn) {
        throw new Error(
          "Failed to find NASAImage in database with date " + args.date
        );
      }
      return NASAImageToReturn;
    },
    NASAImageLikedByUser: async (
      _root: undefined,
      { date, userId }: { date: string; userId: string },
      { db }: { db: Database }
    ) => {
      const queiredNASAImage = await db.NASAImages.findOne({
        date: date,
      });
      const queiredUser = await db.users.findOne({
        _id: userId,
      });

      if (!queiredNASAImage || !queiredUser) {
        throw new Error(
          "failed to find necessary information for NASAImageLikedByUser"
        );
      }

      for (let i = 0; i < queiredUser.likedNASAImages.length; i++) {
        if (
          queiredUser.likedNASAImages[i].toString() ==
          queiredNASAImage._id.toString()
        ) {
          return true;
        }
      }
      return false;
    },
  },
  Mutation: {
    addNASAImage: (
      _root: undefined,
      { dateToGet }: { dateToGet: string },
      { db }: { db: Database }
    ) => {
      async function fetchNASAData(dateToGet: string) {
        //checks if date passed in is valid format
        function isValidDate(dateToGet: string) {
          const regEx = /^\d{4}-\d{2}-\d{2}$/; //####-##-## format
          if (!dateToGet.match(regEx)) return false; // Invalid format
          const d = new Date(dateToGet);

          //no APOD data before 1995-06-16
          if (d < new Date("1995-06-16")) {
            return false;
          }

          const dNum = d.getTime();
          if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
          return d.toISOString().slice(0, 10) === dateToGet;
        }

        if (!isValidDate(dateToGet)) {
          return dateToGet + " is an invalid date";
        }

        //blocks duplicate APOD date requests
        const checkDb = await db.NASAImages.findOne({
          date: dateToGet,
        });

        if (checkDb) {
          return (
            "The APOD picture for " +
            dateToGet +
            " already exists in the database"
          );
        }

        let APIurl = "";
        const randomLikes = Math.floor(Math.random() * 500);
        if (dateToGet) {
          APIurl = baseUrl + apiKey + "&date=" + dateToGet;
        } else {
          APIurl = baseUrl + apiKey;
        }
        const comments: Array<ObjectId> = [];

        //gets data from NASA API
        const response = await fetch(APIurl);
        const data = await response.json();

        const date = data.date;
        const explanation = data.explanation;
        const media_type = data.media_type;
        const title = data.title;
        const url = data.url;
        const hdurl = data.hdurl;
        const service_version = data.service_version;

        if (!date || !explanation || !title || !url) {
          return "Missing Required Data";
        } else {
          await db.NASAImages.insertOne({
            _id: new ObjectId(),
            likes: randomLikes,
            date,
            explanation,
            media_type,
            title,
            url,
            hdurl,
            service_version,
            comments,
          });
        }

        return (
          "Succesfully added the APOD picture for " +
          dateToGet +
          " to the database"
        );
      }

      const responseString = fetchNASAData(dateToGet);
      return responseString;
    },
    like: async (
      _root: undefined,
      { id, userId }: { id: string; userId: string },
      { db }: { db: Database }
    ) => {
      const image_id = new ObjectId(id);
      const likedNASAImage = await db.NASAImages.findOne({
        _id: image_id,
      });

      const userWhoLiked = await db.users.findOne({
        _id: userId,
      });

      if (!likedNASAImage || !userWhoLiked) {
        throw new Error("failed to like NASAImage " + id);
      }

      for (let i = 0; i < userWhoLiked.likedNASAImages.length; i++) {
        if (userWhoLiked.likedNASAImages[i].toString() == id) {
          throw new Error("The user has already liked this image " + id);
        }
      }

      userWhoLiked.likedNASAImages =
        userWhoLiked.likedNASAImages.concat(image_id);

      await db.users.updateOne(
        { _id: userId },
        { $set: { likedNASAImages: userWhoLiked.likedNASAImages } }
      );

      likedNASAImage.likes = ++likedNASAImage.likes;

      await db.NASAImages.updateOne(
        { _id: new ObjectId(id) },
        { $set: { likes: likedNASAImage.likes } }
      );

      return likedNASAImage;
    },
    unlike: async (
      _root: undefined,
      { id, userId }: { id: string; userId: string },
      { db }: { db: Database }
    ) => {
      const image_id = new ObjectId(id);
      const unlikedNASAImage = await db.NASAImages.findOne({
        _id: image_id,
      });

      const userWhoUnliked = await db.users.findOne({
        _id: userId,
      });

      if (!unlikedNASAImage || !userWhoUnliked) {
        throw new Error("failed to unlike NASAImage");
      }

      let userHasLiked = false;
      for (let i = 0; i < userWhoUnliked.likedNASAImages.length; i++) {
        if (userWhoUnliked.likedNASAImages[i].toString() == id) {
          userHasLiked = true;
          userWhoUnliked.likedNASAImages.splice(i, 1);
          break;
        }
      }

      if (!userHasLiked) {
        throw new Error("The user has not liked this image " + id);
      }

      await db.users.updateOne(
        { _id: userId },
        { $set: { likedNASAImages: userWhoUnliked.likedNASAImages } }
      );

      unlikedNASAImage.likes = --unlikedNASAImage.likes;
      db.NASAImages.updateOne(
        { _id: new ObjectId(id) },
        { $set: { likes: unlikedNASAImage.likes } }
      );
      return unlikedNASAImage;
    },
    postComment: async (
      _root: undefined,
      { id, commentText }: { id: string; commentText: string },
      { db }: { db: Database }
    ) => {
      console.log(id + " " + commentText);
      const commentedNASAImage = await db.NASAImages.findOne({
        _id: new ObjectId(id),
      });

      if (!commentedNASAImage) {
        throw new Error("failed to comment NASAImage");
      }

      let commentArr = commentedNASAImage.comments;
      const commentId = new ObjectId();

      if (commentText.length > 0) {
        if (!commentArr) {
          commentArr = [commentId];
        } else {
          commentArr.push(commentId);
        }
      }

      db.NASAImages.updateOne(
        { _id: new ObjectId(id) },
        { $set: { comments: commentArr } }
      );

      return commentedNASAImage;
    },
  },
  NASAImage: {
    id: (nasa_image: NASAImage): string => nasa_image._id.toString(),
  },
};
