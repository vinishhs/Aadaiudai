import admin from 'firebase-admin';
import User from '../models/userModel.js';

// Middleware to verify Firebase ID Token (Attaches Firebase User to req.user)
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using Firebase Admin SDK
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Add the Firebase user data to the request object
            req.user = decodedToken;

            next();
        } catch (error) {
            console.error('Firebase Auth Error:', error.message);
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    }

    if (!token) {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

// Middleware to ensure the user exists in MongoDB (Attaches MongoDB User to req.dbUser)
const requireUser = async (req, res, next) => {
    // This middleware MUST be used after 'protect'
    if (!req.user || !req.user.phone_number) {
        res.status(401);
        return next(new Error('Not authorized, no user data found'));
    }

    try {
        const user = await User.findOne({ phoneNumber: req.user.phone_number });

        if (!user) {
            res.status(401);
            return next(new Error('User not found in database. Please sync first.'));
        }

        req.dbUser = user;
        next();
    } catch (error) {
        next(error);
    }
};

export { protect, requireUser };
