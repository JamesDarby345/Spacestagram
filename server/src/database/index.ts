import { MongoClient } from "mongodb";

const user = 'Admin';
const userPassword ='ChangeM3';
const cluster = 'cluster0.jwqjq';
const url = 
  `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

  export const connectDatabase = async () => {
    const client = await MongoClient.connect(url);
    const db = client.db("main");
  
    return {
      NASAImages: db.collection("test_NASAImages")
    };
  };