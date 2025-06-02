const isOverdue = (deadline) => new Date(deadline) < new Date();

describe("isOverdue", () => {
  test("повертає true для минулої дати", () => {
    const yesterday = new Date(Date.now() - 86400000); // -1 день
    expect(isOverdue(yesterday)).toBe(true);
  });

  test("повертає false для майбутньої дати", () => {
    const tomorrow = new Date(Date.now() + 86400000); // +1 день
    expect(isOverdue(tomorrow)).toBe(false);
  });
});
