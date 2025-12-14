import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cart.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getCart as any);
router.post('/add', addToCart as any);
router.delete('/:sweetId', removeFromCart as any);
router.put('/:sweetId', updateCartItem as any);

export default router;
