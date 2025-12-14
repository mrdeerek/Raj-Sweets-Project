import request from "supertest";
import app from "../app";
import Sweet from "../models/Sweet";
import jwt from "jsonwebtoken";

jest.mock("../models/Sweet");
jest.mock("jsonwebtoken");

describe("Sweet API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default to USER role
        (jwt.verify as jest.Mock).mockReturnValue({ userId: "mockUserId", role: "USER" });
    });

    it("should search sweets by name", async () => {
        const mockSweets = [
            { name: "Chocolate Bar", category: "Chocolates", price: 5, quantity: 10 }
        ];
        (Sweet.find as jest.Mock).mockResolvedValue(mockSweets);

        const res = await request(app)
            .get("/api/sweets/search?query=Chocolate")
            .set("Authorization", "Bearer mocktoken");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockSweets);
        expect(Sweet.find).toHaveBeenCalled();
    });

    it("should add a new sweet (Admin)", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ userId: "adminId", role: "ADMIN" });
        const newSweet = { name: "New Sweet", category: "Test", price: 10, quantity: 50 };
        (Sweet.create as jest.Mock).mockResolvedValue({ ...newSweet, _id: "sweetId" });

        const res = await request(app)
            .post("/api/sweets")
            .set("Authorization", "Bearer admintoken")
            .send(newSweet);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id");
    });

    it("should purchase a sweet", async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ userId: "userId", role: "USER" });
        const sweet = {
            _id: "sweetId",
            name: "Choco",
            quantity: 10,
            save: jest.fn()
        };
        (Sweet.findById as jest.Mock).mockResolvedValue(sweet);

        const res = await request(app)
            .post("/api/sweets/sweetId/purchase")
            .set("Authorization", "Bearer usertoken")
            .send({ quantity: 2 });

        expect(res.status).toBe(200);
        expect(sweet.quantity).toBe(8);
    });
});
