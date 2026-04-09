import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Temple', 'Idol', 'Festivals', 'Events', 'Nature', 'Home', 'Banner']
  },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  altText: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Image', imageSchema);
