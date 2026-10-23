import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  totalFindings: { type: Number, required: true },
  categoryCounts: { email: { type: Number, default: 0 }, phone: { type: Number, default: 0 }, apiKey: { type: Number, default: 0 }, passwordLike: { type: Number, default: 0 } }
}, { timestamps: { createdAt: true, updatedAt: false } });
export default mongoose.model('Scan', schema);
