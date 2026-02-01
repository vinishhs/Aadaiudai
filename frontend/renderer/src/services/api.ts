import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    stock: number;
    features?: string[];
}

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};
