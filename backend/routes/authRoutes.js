import express from 'express';
const router = express.Router();
import { requestOtp } from '../controllers/authController.js';

router.post('/request-otp', requestOtp);

export default router;
