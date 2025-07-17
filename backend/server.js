import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import projectRoutes from './routes/projectRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import { cleanupUploadedImages } from './controllers/projectController.js';
import teamRoutes from './routes/teamRoutes.js';
import contactRoutes from './routes/contactRouter.js';
import serverless from 'serverless-http'; // ✅

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');
fs.promises.mkdir(uploadsDir, { recursive: true })
    .then(() => console.log('✅ Uploads directory ready'))
    .catch(err => console.error('❌ Failed to create uploads directory:', err.message));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/contact', contactRoutes);
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Vercel!' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error on ${req.method} ${req.originalUrl}:`, err);
  if (req.files && (req.files.main || req.files.gallery)) {
    cleanupUploadedImages(req.files);
  }
  res.status(500).json({
    success: false,
    message: 'Unexpected server error',
    error: err.message,
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// ✅ Export the app wrapped with serverless
export const handler = serverless(app);
