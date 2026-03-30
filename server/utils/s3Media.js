import '../config/env.js';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import s3Client from '../config/s3Client.js';

const BUCKET = process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '../..');

const generateKey = (originalName = 'upload') => {
  const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, '_') || 'upload';
  const unique = crypto.randomBytes(8).toString('hex');
  return `gallery/${Date.now()}-${unique}-${safeName}`;
};

const generateLocalKey = (originalName = 'upload') => {
  const ext = path.extname(originalName) || '';
  const base = path.basename(originalName, ext);
  const safeBase = base.replace(/[^a-zA-Z0-9.\-_]/g, '_') || 'upload';
  const unique = crypto.randomBytes(8).toString('hex');
  return `uploads/images/${safeBase}-${Date.now()}-${unique}${ext}`;
};

const ensureUploadsDir = async () => {
  const dir = path.join(projectRoot, 'uploads/images');
  await fs.mkdir(dir, { recursive: true });
  return dir;
};

const buildPublicUrl = (relativeKey) => {
  const normalizedKey = `/${relativeKey.replace(/\\/g, '/')}`;
  const host = (process.env.PUBLIC_APP_URL || process.env.VITE_API_URL || '').replace(/\/?$/, '');
  return host ? `${host}${normalizedKey}` : normalizedKey;
};

const saveFileLocally = async (file) => {
  const key = generateLocalKey(file.originalname);
  const absolutePath = path.join(projectRoot, key);
  await ensureUploadsDir();
  await fs.writeFile(absolutePath, file.buffer);
  return {
    key,
    url: buildPublicUrl(key)
  };
};

const isS3Ready = () => Boolean(BUCKET && REGION);
const isLocalKey = (key = '') => key.startsWith('uploads/');

export const uploadFileToS3 = async (file) => {
  if (!file) {
    throw new Error('No file received for upload');
  }

  if (!isS3Ready()) {
    console.warn('[S3] AWS bucket is not fully configured. Falling back to local storage.');
    return saveFileLocally(file);
  }

  try {
    const key = generateKey(file.originalname);
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await s3Client.send(command);

    const baseUrl = process.env.AWS_PUBLIC_URL || `https://${BUCKET}.s3.${REGION}.amazonaws.com`;
    return {
      key,
      url: `${baseUrl}/${key}`
    };
  } catch (error) {
    console.error('[S3] Upload failed, saving file locally instead:', error.message);
    return saveFileLocally(file);
  }
};

const deleteLocalFile = async (key) => {
  const normalizedKey = key.replace(/^\//, '');
  const absolutePath = path.join(projectRoot, normalizedKey);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('[Uploads] Failed to remove local file:', error.message);
    }
  }
};

export const deleteFileFromS3 = async (key) => {
  if (!key) return;

  if (!isS3Ready() || isLocalKey(key)) {
    await deleteLocalFile(key);
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.warn('[S3] Failed to delete object from S3:', error.message);
  }
};
