import express from 'express';
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService, toggleServiceActive
} from '../controllers/serviceController.js';
const router = express.Router();
import upload from '../middleware/uploadMiddleware.js';

router.post('/', upload.single('image'), createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.put('/:id', upload.single('image'), updateService);
router.delete('/:id', deleteService);
router.patch('/:id/active', toggleServiceActive);

export default router;
