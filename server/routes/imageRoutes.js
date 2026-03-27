import express from 'express';
import { getImages, uploadImage, deleteImage } from '../controllers/imageController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/').get(getImages);
router.route('/upload').post(upload.single('file'), uploadImage);
router.route('/:id').delete(deleteImage);

export default router;
