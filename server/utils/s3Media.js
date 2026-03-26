import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import s3Client from '../config/s3Client.js';

const BUCKET = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION;

const ensureBucketConfigured = () => {
  if (!BUCKET) {
    throw new Error('AWS_BUCKET_NAME is not configured.');
  }
};

const generateKey = (originalName = 'upload') => {
  const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const unique = crypto.randomBytes(8).toString('hex');
  return `gallery/${Date.now()}-${unique}-${safeName}`;
};

export const uploadFileToS3 = async (file) => {
  ensureBucketConfigured();
  if (!file) {
    throw new Error('No file received for upload');
  }

  const key = generateKey(file.originalname);
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  });

  await s3Client.send(command);

  const baseUrl = process.env.AWS_PUBLIC_URL || `https://${BUCKET}.s3.${REGION}.amazonaws.com`;
  return {
    key,
    url: `${baseUrl}/${key}`
  };
};

export const deleteFileFromS3 = async (key) => {
  ensureBucketConfigured();
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key
  });
  await s3Client.send(command);
};
