import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  isFeatured: { type: Boolean, default: false },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);
