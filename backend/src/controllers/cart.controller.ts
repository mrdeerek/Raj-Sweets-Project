import { Request, Response } from 'express';
import Cart, { ICart } from '../models/Cart';
import Sweet from '../models/Sweet';

// Get User Cart
export const getCart = async (req: Request, res: Response) => {
    try {
        let cart = await Cart.findOne({ user: (req as any).user.userId }).populate('items.sweet');
        if (!cart) {
            cart = await Cart.create({ user: (req as any).user.userId, items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};

// Add to Cart
export const addToCart = async (req: Request, res: Response) => {
    const { sweetId, quantity } = req.body;

    if (!sweetId || !quantity) {
        return res.status(400).json({ message: 'Sweet ID and quantity are required' });
    }

    try {
        let cart = await Cart.findOne({ user: (req as any).user.userId });
        if (!cart) {
            cart = new Cart({ user: (req as any).user.userId, items: [] });
        }

        // Check availability
        const sweet = await Sweet.findById(sweetId);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        if (sweet.quantity < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        const itemIndex = cart.items.findIndex(item => item.sweet.toString() === sweetId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ sweet: sweetId, quantity } as any);
        }

        await cart.save();

        // Return fully populated cart so frontend can display details immediately
        const populatedCart = await Cart.findById(cart._id).populate('items.sweet');

        res.status(200).json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error });
    }
};

// Remove from Cart
export const removeFromCart = async (req: Request, res: Response) => {
    const { sweetId } = req.params;

    try {
        const cart = await Cart.findOne({ user: (req as any).user.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.sweet.toString() !== sweetId);
        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.sweet');
        res.status(200).json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error });
    }
};

// Update Quantity
export const updateCartItem = async (req: Request, res: Response) => {
    const { sweetId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    try {
        const cart = await Cart.findOne({ user: (req as any).user.userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.sweet.toString() === sweetId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });

        // Check stock
        const sweet = await Sweet.findById(sweetId);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        if (sweet.quantity < quantity) {
            return res.status(400).json({ message: `Only ${sweet.quantity} items available` });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.sweet');
        res.status(200).json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error });
    }
};
