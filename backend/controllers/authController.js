import User from '../models/userModel.js';

// @desc    Sync user with MongoDB after Firebase verification
// @route   POST /api/auth/sync
// @access  Private (Needs Firebase ID Token)
const syncUser = async (req, res, next) => {
    try {
        const { phone_number, name } = req.user; // From decoded Firebase token via protect middleware

        if (!phone_number) {
            res.status(400);
            return next(new Error('Phone number missing in token'));
        }

        let user = await User.findOne({ phoneNumber: phone_number });

        if (!user) {
            user = await User.create({
                phoneNumber: phone_number,
                name: name || '', // Optional if provided from frontend or token
                wishlist: [],
                orderHistory: [],
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Request OTP (Old Mock logic - kept for backward compatibility if needed)
// @route   POST /api/auth/request-otp
// @access  Public
const requestOtp = async (req, res, next) => {
    // This is now purely for testing or fallback
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
        res.status(400);
        return next(new Error('Please provide a phone number'));
    }
    res.json({ success: true, message: 'OTP flow handled by Firebase Frontend' });
};

export { syncUser, requestOtp };
