import mongoose from "mongoose";
import Sweet from "../models/Sweet";
import dotenv from "dotenv";

dotenv.config();

const clearSweets = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to MongoDB");

        await Sweet.deleteMany({});
        console.log("✅ Revoked: All sweets have been removed from the database.");

        process.exit(0);
    } catch (error) {
        console.error("Error clearing sweets:", error);
        process.exit(1);
    }
};

clearSweets();
