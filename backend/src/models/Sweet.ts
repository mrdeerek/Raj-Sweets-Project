import mongoose from "mongoose";

const sweetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false },
    rating: { type: Number, default: 4.5 },
    numReviews: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Sweet", sweetSchema);
