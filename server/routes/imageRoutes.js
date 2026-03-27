import express from 'express';
import { getImages, uploadImage, deleteImage, getMediaSettings } from '../controllers/imageController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/').get(getImages);
router.route('/upload').post(upload.single('file'), uploadImage);
router.route('/settings').get(getMediaSettings);
router.route('/:id').delete(deleteImage);

export default router;
