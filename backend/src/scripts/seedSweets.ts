import mongoose from "mongoose";
import Sweet from "../models/Sweet";
import dotenv from "dotenv";

dotenv.config();

const sweets = [
    {
        name: "Motichoor Ladoo",
        price: 350,
        description: "Traditional Motichoor Ladoo made with pure ghee.",
        ingredients: ["Besan", "Sugar", "Ghee", "Cardamom"],
        category: "Traditional",
        imageUrl: "https://images.unsplash.com/photo-1599639668352-7360a0cfb32d?w=600",
        quantity: 50
    },
    {
        name: "Kaju Katli",
        price: 800,
        description: "Premium Kaju Katli (Barfi) made from cashews.",
        ingredients: ["Cashews", "Sugar", "Ghee"],
        category: "Traditional",
        imageUrl: "https://images.unsplash.com/photo-1605197584506-c508a6d8fc53?w=600",
        quantity: 30
    },
    {
        name: "Besan Ladoo",
        price: 400,
        description: "Classic Besan Ladoo, roasted to perfection.",
        ingredients: ["Besan", "Sugar", "Ghee"],
        category: "Traditional",
        imageUrl: "https://images.unsplash.com/photo-1599639668352-7360a0cfb32d?w=600",
        quantity: 100
    },
    {
        name: "Rasgulla",
        price: 300,
        description: "Spongy and sweet Rasgulla.",
        ingredients: ["Milk", "Sugar", "Water"],
        category: "Gift Hampers",
        imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600",
        quantity: 20
    }
];

const seedSweets = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/sweet-shop");
        console.log("Connected to MongoDB");

        await Sweet.deleteMany({}); // Clear existing
        console.log("Cleared existing sweets");

        await Sweet.insertMany(sweets);
        console.log("Seeded sweets successfully");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedSweets();
