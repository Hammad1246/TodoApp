import mongoose from "mongoose";

async function connectdb() {
  try {
    
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB", connect.connection.host);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
        process.exit(1)
  }
}

export default connectdb

