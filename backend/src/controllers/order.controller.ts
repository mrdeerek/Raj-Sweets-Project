import { Request, Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Sweet from '../models/Sweet';

export const createOrder = async (req: Request | any, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            res.status(400).json({ message: 'Shipping address is required' });
            return;
        }

        // Get user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.sweet');
        if (!cart || cart.items.length === 0) {
            res.status(400).json({ message: 'Cart is empty' });
            return;
        }

        let totalAmount = 0;
        const orderItems = [];

        // Validate stock and prepare order items
        for (const item of cart.items) {
            const sweet: any = item.sweet;
            if (!sweet) continue;

            if (sweet.quantity < item.quantity) {
                res.status(400).json({ message: `Insufficient stock for ${sweet.name}` });
                return;
            }

            totalAmount += sweet.price * item.quantity;
            orderItems.push({
                sweet: sweet._id,
                quantity: item.quantity,
                priceAtPurchase: sweet.price
            });

            // Update stock
            await Sweet.findByIdAndUpdate(sweet._id, { $inc: { quantity: -item.quantity } });
        }

        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            shippingAddress
        });

        await newOrder.save();

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(newOrder);
    } catch (error: any) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

export const getUserOrders = async (req: Request | any, res: Response): Promise<void> => {
    try {
        const userId = req.user.userId;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.sweet');
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
    }
};


