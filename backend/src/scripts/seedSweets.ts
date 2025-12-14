import mongoose from "mongoose";
import Sweet from "../models/Sweet";
import dotenv from "dotenv";

dotenv.config();

// Using Unsplash IDs with specific query params that are known to work
const sweets = [
    {
        name: "Motichoor Ladoo",
        price: 350,
        description: "Traditional Motichoor Ladoo made with pure ghee.",
        ingredients: ["Besan", "Sugar", "Ghee", "Cardamom"],
        category: "Traditional",
        imageUrl: "https://images.unsplash.com/photo-1599639668352-7360a0cfb32d?q=80&w=600&auto=format&fit=crop",
        quantity: 50
    },
    {
        name: "Kaju Katli",
        price: 800,
        description: "Premium Kaju Katli (Barfi) made from cashews.",
        ingredients: ["Cashews", "Sugar", "Ghee"],
        category: "Traditional",
        imageUrl: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?q=80&w=600&auto=format&fit=crop",
        quantity: 30
    },
    {
        name: "Besan Ladoo",
        price: 400,
        description: "Classic Besan Ladoo, roasted to perfection.",
        ingredients: ["Besan", "Sugar", "Ghee"],
        category: "Traditional",
        imageUrl: "https://images.unsplash.com/photo-1621245645398-35639149021e?q=80&w=600&auto=format&fit=crop",
        quantity: 100
    },
    {
        name: "Rasgulla",
        price: 300,
        description: "Spongy and sweet Rasgulla.",
        ingredients: ["Milk", "Sugar", "Water"],
        category: "Bengali",
        imageUrl: "https://images.unsplash.com/photo-1517244683847-7454b9f14b3b?q=80&w=600&auto=format&fit=crop", // Generic white sweet
        quantity: 20
    },
    {
        name: "Gulab Jamun",
        price: 320,
        description: "Soft and juicy Gulab Jamuns fried in ghee.",
        ingredients: ["Khoya", "Sugar", "Rose Water"],
        category: "Regional",
        imageUrl: "https://images.unsplash.com/photo-1593701460362-d464e8309d94?q=80&w=600&auto=format&fit=crop",
        quantity: 60
    },
    {
        name: "Jalebi",
        price: 280,
        description: "Crispy and sugary Jalebis spiraled to perfection.",
        ingredients: ["Maida", "Sugar", "Saffron"],
        category: "Traditional",
        imageUrl: "https://images.unsplash.com/photo-1601303516519-923cb8845194?q=80&w=600&auto=format&fit=crop",
        quantity: 45
    },
    {
        name: "Soan Papdi",
        price: 250,
        description: "Flaky and sweet Soan Papdi, melts in your mouth.",
        ingredients: ["Besan", "Sugar", "Ghee"],
        category: "Gift Hampers",
        imageUrl: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?q=80&w=600&auto=format&fit=crop", // Similar to Kaju Katli for texture
        quantity: 80
    },
    {
        name: "Mysore Pak",
        price: 500,
        description: "Rich and buttery Mysore Pak from the south.",
        ingredients: ["Besan", "Ghee", "Sugar"],
        category: "Regional",
        imageUrl: "https://images.unsplash.com/photo-1616035882772-2735d49646b8?q=80&w=600&auto=format&fit=crop",
        quantity: 25
    },
    {
        name: "Rasmalai",
        price: 450,
        description: "Creamy and delicious Rasmalai topped with pistachios.",
        ingredients: ["Milk", "Sugar", "Saffron"],
        category: "Bengali",
        imageUrl: "https://images.unsplash.com/photo-1607371981656-78484dd53457?q=80&w=600&auto=format&fit=crop",
        quantity: 15
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
