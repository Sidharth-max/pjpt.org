import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1024 * 1024 } // 1000MB limit for uploading videos and large images
});

export default upload;
