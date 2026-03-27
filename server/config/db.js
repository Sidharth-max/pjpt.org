import './env.js';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('your_mongodb_uri')) {
      console.warn("MongoDB URI not set or is generic. Skipping DB connect to avoid crash.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not exit the process, allow frontend to be served even if DB is down
    // process.exit(1);
  }
};

export default connectDB;
