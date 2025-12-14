import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    sweet: mongoose.Types.ObjectId;
    quantity: number;
    priceAtPurchase: number;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    shippingAddress: string;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

const OrderItemSchema = new Schema({
    sweet: { type: Schema.Types.ObjectId, ref: 'Sweet', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true }
});

const OrderSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
