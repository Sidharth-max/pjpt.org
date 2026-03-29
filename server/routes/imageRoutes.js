import express from 'express';
import { getImages, uploadImage, deleteImage } from '../controllers/imageController.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getImages);
router.route('/upload').post(protect, upload.single('file'), uploadImage);
router.route('/:id').delete(protect, deleteImage);

export default router;
