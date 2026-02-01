import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser

// CORS Config
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from Next.js frontend
    credentials: true // if we needed cookies, but good practice
}));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
