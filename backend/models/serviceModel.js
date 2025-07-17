import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  image: { type: String }, // Optional
  processSteps: [{ type: String, required: true }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;
