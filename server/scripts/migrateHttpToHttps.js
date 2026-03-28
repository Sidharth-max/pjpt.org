import '../config/env.js';
import mongoose from 'mongoose';
import Image from '../models/Image.js';

const MONGO_URI = process.env.MONGO_URI;

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const result = await Image.updateMany(
    { url: /^http:\/\// },
    [{ $set: { url: { $replaceAll: { input: '$url', find: 'http://', replacement: 'https://' } } } }],
    { updatePipeline: true }
  );

  console.log(`Updated ${result.modifiedCount} image record(s).`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
