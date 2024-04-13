import mongoose from "mongoose";
import { DB_NAME } from "../constents.js";

// DB is anothor continent
// Two important points about database connectivity: 

// 1. When connecting to databases, handling potential data-not-found scenarios is essential. Employ try/catch blocks or promises to manage errors or we can also use promises.

// key to remember : ( wrap in try-catch )

// 2. Database operations involve latency, and traditional synchronous code can lead to blocking, where the program waits for the database query to complete before moving on. So, we should async/await which allows for non-blocking execution, enabling the program to continue with other tasks while waiting for the database response. 

// key to remember :  ( always remember the database is in another continent, so use async await)


const connectDB = async ()=>{
  try{
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n Mongodb connected!! DB HOST: ${connectionInstance.connection.host}`);
  }
  catch(err){
    console.log("MongoDb connection error:", err);
    process.exit(1);
  }
}
export default connectDB;