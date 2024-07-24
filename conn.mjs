import dotenv from 'dotenv';
dotenv.config();
import { MongoClient } from "mongodb"
import mongoose from "mongoose";

const URI = process.env.DATABASE_CONNECT

export const client = new MongoClient(URI)


export const connect = async () => {
    try {
        await client.connect()
        //console.log("connected")
        return true
    } catch (error) {
       // console.log(error)
       await client.close()
        return false
    }
    
}


 const connectDB = () =>{
  const url = URI;
 
  try {
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected: ${url}`);
  });
 
  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
}
export default connectDB
