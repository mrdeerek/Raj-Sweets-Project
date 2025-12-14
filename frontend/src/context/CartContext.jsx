import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!user) {
            setCart(null);
            return;
        }
        try {
            const response = await api.get('/cart');
            setCart(response.data);
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (sweetId, quantity = 1) => {
        if (!user) {
            // Can't add to cart if not logged in
            // Ideally we'd show a login modal or redirect, but for now throw error to be caught by component
            throw new Error("Please login to add items to cart");
        }
        try {
            setLoading(true);
            const response = await api.post('/cart/add', { sweetId, quantity });
            setCart(response.data);
            return true;
        } catch (error) {
            console.error("Add to cart error", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (sweetId) => {
        try {
            const response = await api.delete(`/cart/${sweetId}`);
            setCart(response.data);
        } catch (error) {
            console.error("Remove from cart error", error);
        }
    };

    const updateQuantity = async (sweetId, quantity) => {
        try {
            setLoading(true);
            const response = await api.put(`/cart/${sweetId}`, { quantity });
            setCart(response.data);
        } catch (error) {
            console.error("Update quantity error", error);
        } finally {
            setLoading(false);
        }
    };

    const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, fetchCart, cartCount, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
