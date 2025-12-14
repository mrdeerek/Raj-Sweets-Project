import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import bcrypt from "bcryptjs";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const createTestUser = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/sweet-shop";
        console.log("Connecting to:", uri);
        await mongoose.connect(uri);

        const email = "user@example.com";
        const password = "password123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Test user already exists. Resetting to USER role...");
            existingUser.role = "USER";
            existingUser.password = hashedPassword;
            await existingUser.save();
        } else {
            await User.create({
                email,
                password: hashedPassword,
                role: "USER"
            });
            console.log("Test user created.");
        }

        console.log(`\n✅ User Credentials:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}\n`);

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createTestUser();
