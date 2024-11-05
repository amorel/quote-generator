import type { QuoteDTO } from "@quote-generator/shared";

describe("QuoteDTO", () => {
  it("should have correct structure", () => {
    const quoteDTO: QuoteDTO = {
      _id: "test-id",
      content: "Test content",
      author: "Test Author",
      tags: ["tag1", "tag2"],
    };

    expect(quoteDTO).toHaveProperty("_id");
    expect(quoteDTO).toHaveProperty("content");
    expect(quoteDTO).toHaveProperty("author");
    expect(quoteDTO).toHaveProperty("tags");
    expect(Array.isArray(quoteDTO.tags)).toBe(true);
  });

  it("should allow empty tags array", () => {
    const quoteDTO: QuoteDTO = {
      _id: "test-id",
      content: "Test content",
      author: "Test Author",
      tags: [],
    };

    expect(quoteDTO.tags).toEqual([]);
  });
});
