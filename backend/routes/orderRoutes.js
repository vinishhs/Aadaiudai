import express from 'express';
const router = express.Router();
import { createOrder, verifyPayment } from '../controllers/orderController.js';
import { protect, requireUser } from '../middleware/authMiddleware.js';

router.post('/create', protect, requireUser, createOrder);
router.post('/verify', protect, requireUser, verifyPayment);

export default router;
