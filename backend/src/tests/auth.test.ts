import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import app from "../app";
import User from "../models/User";
import bcrypt from "bcryptjs";

// Mock the model methods
jest.mock("../models/User");
jest.mock("bcryptjs");

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    // Mock findOne to return null (user doesn't exist)
    (User.findOne as jest.Mock).mockResolvedValue(null);
    // Mock create
    (User.create as jest.Mock).mockResolvedValue({
      email: "testuser@gmail.com",
      password: "hashedpassword",
      _id: "mockUserId",
      role: "USER"
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        email: "testuser@gmail.com",
        password: "password123"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  it("should login an existing user and return a token", async () => {
    // Mock findOne to return a user
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: "mockUserId",
      email: "testuser@gmail.com",
      password: "hashedpassword",
      role: "USER"
    });
    // Mock bcrypt compare
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@gmail.com",
        password: "password123"
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
