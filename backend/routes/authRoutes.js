import express from 'express';
const router = express.Router();
import { requestOtp, syncUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/request-otp', requestOtp);
router.post('/sync', protect, syncUser);

export default router;
