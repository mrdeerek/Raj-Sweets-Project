import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import bcrypt from "bcryptjs";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const createAdmin = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017/sweet-shop";
        console.log("Connecting to:", uri);
        await mongoose.connect(uri);

        const email = "admin@awsweets.in";
        const password = "adminpassword123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log("Admin already exists. Updating role/password...");
            existingAdmin.role = "ADMIN";
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
        } else {
            await User.create({
                email,
                password: hashedPassword,
                role: "ADMIN"
            });
            console.log("Admin user created.");
        }

        console.log(`\n✅ Admin Credentials:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}\n`);

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
