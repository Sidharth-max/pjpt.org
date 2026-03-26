import Image from '../models/Image.js';
import cloudinary from '../config/cloudinary.js';

const allowMediaDelete = (process.env.ALLOW_MEDIA_DELETE || '').toLowerCase() === 'true';

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

    const newImage = new Image({
      title,
      category,
      url: req.file.path,
      publicId: req.file.filename
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteImage = async (req, res) => {
  if (!allowMediaDelete) {
    return res.status(403).json({ message: 'Media deletion is disabled in this environment' });
  }

  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();
    res.json({ message: 'Image removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
