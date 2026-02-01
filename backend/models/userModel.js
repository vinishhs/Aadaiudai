import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    orderHistory: [{
        // This could be an array of Order IDs if you have an Order model, 
        // or embedded order objects. For now, we'll keep it simple or flexible.
        // For a boutique, detailed order history is key.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order' // Assuming we'll have an Order model later
    }],
    // Temporary for OTP auth maybe?
    // otp: String,
    // otpExpires: Date
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
