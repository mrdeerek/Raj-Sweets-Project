
import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import mongoose from "mongoose";
import app from "../app";

jest.mock("../models/User", () => ({
  create: jest.fn().mockResolvedValue({
    email: "testuser@gmail.com"
  })
}));


describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "testuser@gmail.com",
        password: "password123"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
  });
});
