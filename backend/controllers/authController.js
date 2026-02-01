// @desc    Request OTP
// @route   POST /api/auth/request-otp
// @access  Public
const requestOtp = async (req, res, next) => {
    // Mock logic for now
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        res.status(400);
        const error = new Error('Please provide a phone number');
        return next(error);
    }

    // In a real app, integrate Firebase/Twilio here
    console.log(`OTP requested for ${phoneNumber}`);

    res.json({
        success: true,
        message: 'OTP sent successfully (Mock)',
    });
};

export { requestOtp };
