import './env.js';
import { S3Client } from '@aws-sdk/client-s3';

const requiredEnv = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[S3] Missing environment variable ${key}. Uploads may fail until it is set.`);
  }
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined
});

export default s3Client;
