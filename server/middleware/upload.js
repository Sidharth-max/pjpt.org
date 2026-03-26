import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pjpt_gallery',
    resource_type: 'auto',
    // removed allowed_formats to allow videos and other media
  },
});

const upload = multer({ storage });
export default upload;
