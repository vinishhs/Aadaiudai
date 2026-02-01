import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, data: products });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json({ success: true, data: product });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        // Handle CastError (invalid ObjectId) specifically if needed, or let general handler catch it
        if (error.name === 'CastError') {
            res.status(404);
            next(new Error('Product not found'));
        } else {
            next(error);
        }
    }
};

export { getProducts, getProductById };
