import admin from 'firebase-admin';

// Middleware to verify Firebase ID Token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using Firebase Admin SDK
            const decodedToken = await admin.auth().verifyIdToken(token);

            // Add the user data to the request object
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

export { protect };
