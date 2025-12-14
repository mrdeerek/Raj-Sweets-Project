import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      role: "USER"
    });

    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    return res.status(500).json({
      message: "Registration failed"
    });
  }

};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

// FORGOT PASSWORD (MOCK)
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Security: don't reveal if user exists
      return res.status(200).json({ message: "If an account exists, a reset link has been sent to your email." });
    }

    // In a real app, generate token and send email.
    // Here we just log it.
    console.log(`[MOCK EMAIL] Password reset requested for: ${email}`);

    return res.status(200).json({ message: "If an account exists, a reset link has been sent to your email." });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Request failed" });
  }
};
