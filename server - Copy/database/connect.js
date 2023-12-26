import mongoose from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server";
async function connect() {
    const mongoURI = 'mongodb://localhost:27017/registerUser'; // Replace with your MongoDB URI
    const db = await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB ');
    return db;
  }
  
  export default connect;