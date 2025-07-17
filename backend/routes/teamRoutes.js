import express from 'express';
import { createTeam, deleteTeam,  getTeam,  updateTeam } from '../controllers/teamController.js';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getTeam);       
router.get('/:id', getTeam);      

router.post('/', protect, upload.single('image'), createTeam);   
router.put('/:id', protect, upload.single('image'), updateTeam);  
router.delete('/:id', protect, deleteTeam);

export default router;

