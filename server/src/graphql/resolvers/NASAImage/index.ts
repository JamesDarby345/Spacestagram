import { IResolvers } from "@graphql-tools/utils";
import { Database, NASAImage } from "../../../lib/types";
import { ObjectId } from "mongodb";

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
          "failed to find NASAImage in database" + args.date
        );
      }
      return NASAImageToReturn;
    },
  },
  Mutation: {
    addNASAImage: (
      _root: undefined,
      { dateToGet }: { dateToGet: string },
      { db }: { db: Database }
    ) => {
      async function fetchNASAData(dateToGet: string) {
        let APIurl = "";
        const randomLikes = Math.floor(Math.random() * 500);
        if (dateToGet) {
          APIurl = baseUrl + apiKey + "&date=" + dateToGet;
        } else {
          APIurl = baseUrl + apiKey;
        }
        const response = await fetch(APIurl);
        const data = await response.json();

        //const date = data.date;
        console.log("data");
        console.log(data);
        console.log(data.date);
        //const newNASAImage: NASAImage = JSON.parse(data);
        console.log("new nasa image");
        //console.log(newNASAImage);

        const date = data.date;
        const explanation = data.explanation;
        console.log(explanation);
        const media_type = data.media_type;
        const title = data.title;
        const url = data.url;
        const hdurl = data.hdurl;
        const service_version = data.service_version;

        //TODO: check for duplicates here
        const insertResult = await db.NASAImages.insertOne({
          _id: new ObjectId(),
          likes: randomLikes,
          date,
          explanation,
          media_type,
          title,
          url,
          hdurl,
          service_version,
        });
        return insertResult;
      }
      const insertNewImage = fetchNASAData(dateToGet);
      return insertNewImage;
    },
    like: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ) => {
      const likedNASAImage = await db.NASAImages.findOne({
        _id: new ObjectId(id),
      });

      if (!likedNASAImage) {
        throw new Error("failed to like NASAImage" + id);
      }

      likedNASAImage.likes = likedNASAImage.likes + 1;
      db.NASAImages.updateOne(
        { _id: new ObjectId(id) },
        { $set: { likes: likedNASAImage.likes } }
      );
      return likedNASAImage;
    },
    unlike: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ) => {
      const unlikedNASAImage = await db.NASAImages.findOne({
        _id: new ObjectId(id),
      });

      if (!unlikedNASAImage) {
        throw new Error("failed to unlike NASAImage");
      }

      unlikedNASAImage.likes = unlikedNASAImage.likes - 1;
      db.NASAImages.updateOne(
        { _id: new ObjectId(id) },
        { $set: { likes: unlikedNASAImage.likes } }
      );
      return unlikedNASAImage;
    },
  },
  NASAImage: {
    id: (nasa_image: NASAImage): string => nasa_image._id.toString(),
  },
};
