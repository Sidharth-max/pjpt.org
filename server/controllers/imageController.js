import Image from '../models/Image.js';
import { uploadFileToS3, deleteFileFromS3 } from '../utils/s3Media.js';

const allowMediaDelete = (process.env.ALLOW_MEDIA_DELETE || '').toLowerCase() === 'true';
const allowMediaUpload = (process.env.ALLOW_MEDIA_UPLOAD || '').toLowerCase() === 'true';
const requiredUploadEnv = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME'];
const mediaDeletionDisabledMessage = 'Media deletion is disabled in this environment.';

const getUploadAvailability = () => {
  if (!allowMediaUpload) {
    return {
      allowed: false,
      reason: 'Media uploads are disabled in this environment.'
    };
  }

  const missing = requiredUploadEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    return {
      allowed: false,
      reason: `Media uploads are blocked until the following environment variables are configured: ${missing.join(', ')}`,
      missingEnv: missing
    };
  }

  return { allowed: true, missingEnv: [] };
};

export const getMediaSettings = (_req, res) => {
  const availability = getUploadAvailability();

  res.json({
    allowUpload: availability.allowed,
    uploadReason: availability.allowed ? null : availability.reason,
    missingUploadEnv: availability.missingEnv || [],
    allowDelete: allowMediaDelete,
    deleteReason: allowMediaDelete ? null : mediaDeletionDisabledMessage
  });
};

export const getImages = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    const images = await Image.find(query).sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const availability = getUploadAvailability();
    if (!availability.allowed) {
      return res.status(503).json({ message: availability.reason });
    }

    const { title, category } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const uploadResult = await uploadFileToS3(req.file);

    const newImage = new Image({
      title,
      category,
      url: uploadResult.url,
      publicId: uploadResult.key
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  if (!allowMediaDelete) {
    return res.status(403).json({ message: mediaDeletionDisabledMessage });
  }

  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    try {
      await deleteFileFromS3(image.publicId);
    } catch (err) {
      console.warn('Failed to delete object from S3', err.message);
    }
    await image.deleteOne();
    res.json({ message: 'Image removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
