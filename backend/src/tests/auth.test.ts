import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import app from "../app";

jest.mock("../models/User", () => ({
  create: jest.fn().mockResolvedValue({
    email: "testuser@gmail.com",
    password: "hashedpassword"
  }),
  findOne: jest.fn().mockResolvedValue({
    _id: "mockUserId",
    email: "testuser@gmail.com",
    password: "hashedpassword",
    role: "USER"
  })
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue("hashedpassword")
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

  it("should login an existing user and return a token", async () => {
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
