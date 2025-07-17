import express from 'express';
import {
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

const uploads = upload.fields([
  { name: 'main', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.get('/slug/:slug', getProjectBySlug);
// Protected routes
router.post('/create', protect, uploads, createProject);
router.put('/:id', protect, uploads, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;



