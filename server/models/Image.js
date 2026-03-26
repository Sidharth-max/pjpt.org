import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['All', 'Temple', 'Idol', 'Festivals', 'Events', 'Nature']
  },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Image', imageSchema);
