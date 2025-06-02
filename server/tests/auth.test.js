const request = require("supertest");
const app = require("../index");

describe("GET /api/profile", () => {
  it("повертає 401 без валідного токена", async () => {
    const res = await request(app).get("/api/profile");
    expect(res.statusCode).toBe(401);
  });
});
