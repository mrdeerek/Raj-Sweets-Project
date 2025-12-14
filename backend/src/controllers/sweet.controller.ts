import { Request, Response } from "express";
import Sweet from "../models/Sweet";

// ➕ Add Sweet (Admin)
export const addSweet = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json(sweet);
  } catch {
    res.status(500).json({ message: "Failed to add sweet" });
  }
};

// 📄 Get All Sweets
// 📄 Get All Sweets
export const getSweets = async (_: Request, res: Response) => {
  const sweets = await Sweet.find();
  res.status(200).json(sweets);
};

// ❌ Delete Sweet (Admin)
export const deleteSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const sweet = await Sweet.findByIdAndDelete(id);
    if (!sweet) {
      res.status(404).json({ message: "Sweet not found" });
      return;
    }
    res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sweet" });
  }
};

// ⭐ Rate Sweet (User)
export const rateSweet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      res.status(404).json({ message: "Sweet not found" });
      return;
    }

    const prevRating = sweet.rating || 0;
    const prevReviews = sweet.numReviews || 0;

    // Calculate new average
    const newRating = ((prevRating * prevReviews) + Number(rating)) / (prevReviews + 1);

    sweet.rating = parseFloat(newRating.toFixed(1));
    sweet.numReviews = prevReviews + 1;

    await sweet.save();
    res.status(200).json(sweet);
  } catch (error) {
    res.status(500).json({ message: "Error rating sweet", error });
  }
};

// 🆔 Get Sweet By ID
export const getSweetById = async (req: Request, res: Response) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });
    res.status(200).json(sweet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sweet" });
  }
};

// 🔍 Search Sweets
// 🔍 Search Sweets
export const searchSweets = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: "Query parameter required" });
    }

    // 1. Price Range: "X to Y"
    const rangeMatch = query.match(/^(\d+)\s+to\s+(\d+)$/i);
    if (rangeMatch) {
      const sweets = await Sweet.find({
        price: { $gte: parseFloat(rangeMatch[1]), $lte: parseFloat(rangeMatch[2]) }
      });
      return res.status(200).json(sweets);
    }

    // 2. Price Limit: "under X" or "below X"
    const underMatch = query.match(/^(under|below)\s+(\d+)$/i);
    if (underMatch) {
      const sweets = await Sweet.find({
        price: { $lte: parseFloat(underMatch[2]) }
      });
      return res.status(200).json(sweets);
    }

    // 3. Price Limit: "above X" or "over X"
    const aboveMatch = query.match(/^(above|over)\s+(\d+)$/i);
    if (aboveMatch) {
      const sweets = await Sweet.find({
        price: { $gte: parseFloat(aboveMatch[2]) }
      });
      return res.status(200).json(sweets);
    }

    // 4. Category: "category:Name"
    const catMatch = query.match(/^category\s*:\s*(.+)$/i);
    if (catMatch) {
      const sweets = await Sweet.find({
        category: new RegExp(catMatch[1].trim(), "i")
      });
      return res.status(200).json(sweets);
    }

    // 5. Default Text Search
    const searchRegex = new RegExp(query, "i");
    const sweets = await Sweet.find({
      $or: [
        { name: searchRegex },
        { category: searchRegex }
      ]
    });

    res.status(200).json(sweets);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

// ✏️ Update Sweet (Admin)
export const updateSweet = async (req: Request, res: Response) => {
  const updated = await Sweet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updated);
};



// 🛒 Purchase Sweet (User)
export const purchaseSweet = async (req: Request, res: Response) => {
  const { quantity } = req.body;

  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) {
    return res.status(404).json({ message: "Sweet not found" });
  }

  if (sweet.quantity < quantity) {
    return res.status(400).json({ message: "Insufficient stock" });
  }

  sweet.quantity -= quantity;
  await sweet.save();

  res.status(200).json({
    message: "Purchase successful",
    remainingStock: sweet.quantity
  });
};

// 📦 Restock Sweet (Admin)
export const restockSweet = async (req: Request, res: Response) => {
  const { quantity } = req.body;

  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) {
    return res.status(404).json({ message: "Sweet not found" });
  }

  sweet.quantity += quantity;
  await sweet.save();

  res.status(200).json({
    message: "Restock successful",
    updatedStock: sweet.quantity
  });
};
