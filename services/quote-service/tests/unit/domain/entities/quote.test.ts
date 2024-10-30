import { Quote } from "../../../../src/domain/entities/Quote";
import QuoteContent from "../../../../src/domain/value-objects/QuoteContent";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("Quote Entity", () => {
  const mockQuote = new Quote(
    "test-id",
    QuoteContent.create("Test quote content"),
    "author-id",
    ["tag1", "tag2"]
  );

  it("should create a quote with valid data", () => {
    expect(mockQuote.getId()).toBe("test-id");
    expect(mockQuote.getContent().getValue()).toBe("Test quote content");
    expect(mockQuote.getAuthorId()).toBe("author-id");
    expect(mockQuote.getTags()).toEqual(["tag1", "tag2"]);
  });

  it("should return a copy of tags array", () => {
    const tags = mockQuote.getTags();
    tags.push("tag3");
    expect(mockQuote.getTags()).toEqual(["tag1", "tag2"]);
  });
});
