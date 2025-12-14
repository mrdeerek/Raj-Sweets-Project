import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import sweetRoutes from "./routes/sweet.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json()); // 🔥 THIS LINE IS CRITICAL

import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
