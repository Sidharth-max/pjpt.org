import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(upload.single('image'), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(upload.single('image'), updateEvent)
  .delete(deleteEvent);

export default router;
