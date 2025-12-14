import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
    sweet: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
}

const CartItemSchema = new Schema({
    sweet: { type: Schema.Types.ObjectId, ref: 'Sweet', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 }
});

const CartSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.model<ICart>('Cart', CartSchema);
