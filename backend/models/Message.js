import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  subject: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Message', schema);
