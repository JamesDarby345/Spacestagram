// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { connectDatabase } from "../src/database";

const clear = async () => {
  try {
    console.log(`clear running...`);

    const db = await connectDatabase();

    const users = await db.users.find({}).toArray();
    const comments = await db.comments.find({}).toArray();
    const NASAImages = await db.NASAImages.find({}).toArray();

    //WARNING: this will clear the database!!!
    if (users.length > 0) {
      await db.users.drop();
    }
    if (comments.length > 0) {
      await db.comments.drop();
    }
    //if (NASAImages.length > 0){
    //await db.NASAImages.drop();
    //}

    console.log("successfully cleared test database");
  } catch (error) {
    throw new Error("failed to clear database");
  }
};

clear();
