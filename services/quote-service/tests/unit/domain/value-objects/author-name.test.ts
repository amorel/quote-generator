import AuthorName from "../../../../src/domain/value-objects/AuthorName";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("AuthorName", () => {
  it("should create valid author name", () => {
    const name = AuthorName.create("John Doe");
    expect(name.getValue()).toBe("John Doe");
  });

  it("should trim whitespace", () => {
    const name = AuthorName.create("  John Doe  ");
    expect(name.getValue()).toBe("John Doe");
  });

  it("should throw error for empty name", () => {
    expect(() => AuthorName.create("")).toThrow("Author name cannot be empty");
    expect(() => AuthorName.create("   ")).toThrow(
      "Author name cannot be empty"
    );
  });

  it("should throw error for too long name", () => {
    const longName = "a".repeat(101);
    expect(() => AuthorName.create(longName)).toThrow(
      "Author name cannot exceed 100 characters"
    );
  });
});
