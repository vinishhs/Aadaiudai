import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        // enum: ['Sarees', 'Kurtis', 'Lehengas', 'Gowns', 'Accessories'], // Optional: Restrict categories
    },
    images: [{
        type: String,
        required: true,
    }],
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    features: [{
        type: String,
    }]
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
