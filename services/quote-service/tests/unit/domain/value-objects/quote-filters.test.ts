import { QuoteFilters } from "../../../../src/domain/value-objects/QuoteFilters";
import { ValidationError } from "../../../../src/interface/errors";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("QuoteFilters", () => {
  it("should create valid filters", () => {
    const filters = QuoteFilters.create({
      limit: 10,
      maxLength: 100,
      minLength: 50,
      tags: "tag1,tag2",
      author: "John Doe",
    });

    expect(filters.limit).toBe(10);
    expect(filters.maxLength).toBe(100);
    expect(filters.minLength).toBe(50);
    expect(filters.tags).toEqual(["tag1", "tag2"]);
    expect(filters.author).toBe("John Doe");
  });

  it("should validate limit range", () => {
    expect(() => QuoteFilters.create({ limit: 0 })).toThrow(ValidationError);
    expect(() => QuoteFilters.create({ limit: 51 })).toThrow(ValidationError);
  });

  it("should validate length constraints", () => {
    expect(() => QuoteFilters.create({ maxLength: -1 })).toThrow(
      ValidationError
    );
    expect(() => QuoteFilters.create({ minLength: -1 })).toThrow(
      ValidationError
    );
    expect(() =>
      QuoteFilters.create({ minLength: 100, maxLength: 50 })
    ).toThrow(ValidationError);
  });

  it("should process tags correctly", () => {
    const filters = QuoteFilters.create({ tags: "tag1, tag2,tag3" });
    expect(filters.tags).toEqual(["tag1", "tag2", "tag3"]);
  });

  it("should handle empty or undefined values", () => {
    const filters = QuoteFilters.create({});
    expect(filters.limit).toBeUndefined();
    expect(filters.maxLength).toBeUndefined();
    expect(filters.minLength).toBeUndefined();
    expect(filters.tags).toBeUndefined();
    expect(filters.author).toBeUndefined();
  });
});
