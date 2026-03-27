import Image from '../models/Image.js';
import { uploadFileToS3, deleteFileFromS3 } from '../utils/s3Media.js';

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
