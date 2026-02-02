import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID ? 'LOADED' : 'MISSING');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create new order & Initialize Razorpay Payment
// @route   POST /api/orders/create
// @access  Private
const createOrder = async (req, res, next) => {
    console.log('--- Order Creation Started ---');
    console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID ? 'LOADED' : 'MISSING');
    try {
        const { orderItems, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            return next(new Error('No order items'));
        }

        // 1. Atomicity: Save Pending Order to MongoDB first
        console.log('Attempting to save order to MongoDB...');
        const order = new Order({
            user: req.dbUser._id,
            orderItems,
            totalPrice,
            isPaid: false
        });

        const createdOrder = await order.save();
        console.log('Order saved to MongoDB:', createdOrder._id);

        // 2. Initialize Razorpay Order
        console.log('Initializing Razorpay Order with amount:', Math.round(totalPrice * 100));
        const options = {
            amount: Math.round(totalPrice * 100), // Amount in paise
            currency: "INR",
            receipt: `receipt_${createdOrder._id}`,
        };

        const rzpOrder = await razorpay.orders.create(options);
        console.log('Razorpay Order Created:', rzpOrder.id);

        // 3. Update Order with Razorpay ID
        createdOrder.razorpayOrderId = rzpOrder.id;
        await createdOrder.save();
        console.log('Order updated with Razorpay ID');

        res.status(201).json({
            success: true,
            order: createdOrder,
            razorpayOrder: rzpOrder
        });

    } catch (error) {
        console.error('Order Creation Step Failed:'.red.bold, error);
        next(error);
    }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/orders/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Security: Reconstruct signature
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature === razorpay_signature) {
            // Payment is verified
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'captured',
                    update_time: new Date().toISOString()
                };

                const updatedOrder = await order.save();
                res.json({ success: true, order: updatedOrder });
            } else {
                res.status(404);
                next(new Error('Order not found'));
            }
        } else {
            res.status(400);
            next(new Error('Payment verification failed (Signature Mismatch)'));
        }
    } catch (error) {
        next(error);
    }
};

export { createOrder, verifyPayment };
