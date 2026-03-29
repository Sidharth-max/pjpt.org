import './env.js';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri || mongoUri.includes('your_mongodb_uri')) {
      console.warn("MongoDB URI not set or is generic. Skipping DB connect to avoid crash.");
      return;
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not exit the process, allow frontend to be served even if DB is down
    // process.exit(1);
  }
};

export default connectDB;
