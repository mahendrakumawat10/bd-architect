// routes/contactRouter.js
import express from 'express';
import { sendContactEmail, sendEnquiryEmail } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', sendContactEmail); 
router.post('/enquiry', sendEnquiryEmail); 

export default router;
