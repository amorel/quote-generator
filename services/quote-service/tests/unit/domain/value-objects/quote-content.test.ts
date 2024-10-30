import QuoteContent from "../../../../src/domain/value-objects/QuoteContent";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("QuoteContent", () => {
  it("should create valid quote content", () => {
    const content = QuoteContent.create("Valid quote content");
    expect(content.getValue()).toBe("Valid quote content");
  });

  it("should trim whitespace", () => {
    const content = QuoteContent.create("  Trimmed content  ");
    expect(content.getValue()).toBe("Trimmed content");
  });

  it("should throw error for empty content", () => {
    expect(() => QuoteContent.create("")).toThrow(
      "Quote content cannot be empty"
    );
    expect(() => QuoteContent.create("   ")).toThrow(
      "Quote content cannot be empty"
    );
  });

  it("should throw error for too long content", () => {
    const longContent = "a".repeat(501);
    expect(() => QuoteContent.create(longContent)).toThrow(
      "Quote content cannot exceed 500 characters"
    );
  });
});
