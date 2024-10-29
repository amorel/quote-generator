import { QuoteDTO } from "../../../../src/application/dtos/QuoteDTO";

describe("QuoteDTO", () => {
  it("should have correct structure", () => {
    const quoteDTO: QuoteDTO = {
      id: "test-id",
      content: "Test content",
      authorName: "Test Author",
      tags: ["tag1", "tag2"],
    };

    expect(quoteDTO).toHaveProperty("id");
    expect(quoteDTO).toHaveProperty("content");
    expect(quoteDTO).toHaveProperty("authorName");
    expect(quoteDTO).toHaveProperty("tags");
    expect(Array.isArray(quoteDTO.tags)).toBe(true);
  });

  it("should allow empty tags array", () => {
    const quoteDTO: QuoteDTO = {
      id: "test-id",
      content: "Test content",
      authorName: "Test Author",
      tags: [],
    };

    expect(quoteDTO.tags).toEqual([]);
  });
});
