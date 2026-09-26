import mongoose from 'mongoose';
export default async function connectDB() {
  if (!process.env.MONGO_URI) return console.warn('MONGO_URI not set - contact form will return an error.');
  try { await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 }); console.log('MongoDB connected'); }
  catch (e) { console.error('MongoDB connection failed:', e.message); }
}
