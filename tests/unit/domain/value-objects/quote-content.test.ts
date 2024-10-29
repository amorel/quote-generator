import QuoteContent from "../../../../src/domain/value-objects/QuoteContent";
import { ValidationError } from "../../../../src/errors";

describe("QuoteContent", () => {
  it("should create valid quote content", () => {
    const content = "Valid quote content";
    const quoteContent = QuoteContent.create(content);
    expect(quoteContent.getValue()).toBe(content);
  });

  it("should throw error for empty content", () => {
    expect(() => QuoteContent.create("")).toThrow(ValidationError);
  });

  it("should throw error for content exceeding max length", () => {
    const longContent = "a".repeat(501);
    expect(() => QuoteContent.create(longContent)).toThrow(ValidationError);
  });

  it("should be immutable", () => {
    const quoteContent = QuoteContent.create("Test content");
    const originalValue = quoteContent.getValue();

    // Try to modify the internal value
    try {
      (quoteContent as any).value = "Changed content";
    } catch (e) {
      // Some environments might throw on attempted modification of frozen object
    }

    expect(quoteContent.getValue()).toBe(originalValue);
  });

  it("should trim whitespace", () => {
    const content = "  Test content  ";
    const quoteContent = QuoteContent.create(content);
    expect(quoteContent.getValue()).toBe(content.trim());
  });
});
