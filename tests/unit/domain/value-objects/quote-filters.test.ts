import { QuoteFiltersVO } from "../../../../src/domain/value-objects/QuoteFilters";
import { ValidationError } from "../../../../src/errors";

describe("QuoteFiltersVO", () => {
  it("should create filters with valid data", () => {
    const filters = QuoteFiltersVO.create({
      limit: 10,
      maxLength: 100,
      minLength: 50,
      tags: "tag1,tag2",
      author: "Test Author",
    });

    expect(filters.limit).toBe(10);
    expect(filters.maxLength).toBe(100);
    expect(filters.minLength).toBe(50);
    expect(filters.tags).toEqual(["tag1", "tag2"]);
    expect(filters.author).toBe("Test Author");
  });

  it("should handle empty filters", () => {
    const filters = QuoteFiltersVO.create({});
    expect(filters.limit).toBe(1); // default value
    expect(filters.maxLength).toBeUndefined();
    expect(filters.minLength).toBeUndefined();
    expect(filters.tags).toEqual([]);
    expect(filters.author).toBeUndefined();
  });

  it("should validate limit range", () => {
    expect(() => QuoteFiltersVO.create({ limit: 0 })).toThrow(ValidationError);
    expect(() => QuoteFiltersVO.create({ limit: 51 })).toThrow(ValidationError);
    expect(() => QuoteFiltersVO.create({ limit: 1 })).not.toThrow();
    expect(() => QuoteFiltersVO.create({ limit: 50 })).not.toThrow();
  });

  it("should properly parse tags", () => {
    const filters = QuoteFiltersVO.create({ tags: "tag1, tag2,tag3" });
    expect(filters.tags).toEqual(["tag1", "tag2", "tag3"]);
  });

  it("should handle empty tags string", () => {
    const filters = QuoteFiltersVO.create({ tags: "" });
    expect(filters.tags).toEqual([]);
  });

  it("should return a copy of tags array", () => {
    const filters = QuoteFiltersVO.create({ tags: "tag1,tag2" });
    const tags = filters.tags;
    tags.push("tag3");
    expect(filters.tags).toEqual(["tag1", "tag2"]);
  });
});
