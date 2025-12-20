// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { getProducts } from '../api/services/economyService';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return { products, loading, error, refetch: () => getProducts().then(setProducts) };
};