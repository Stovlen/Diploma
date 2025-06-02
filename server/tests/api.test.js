const request = require("supertest");
const app = require("../index"); // шлях до index.js

describe("GET /", () => {
  it("повертає повідомлення про роботу сервера", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("TaskMaster backend is working!");
  });
});
