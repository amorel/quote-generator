import TagName from "../../../../src/domain/value-objects/TagName";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("TagName", () => {
  it("should create valid tag name", () => {
    const name = TagName.create("Inspiration");
    expect(name.getValue()).toBe("Inspiration");
  });

  it("should trim whitespace", () => {
    const name = TagName.create("  Inspiration  ");
    expect(name.getValue()).toBe("Inspiration");
  });

  it("should throw error for empty name", () => {
    expect(() => TagName.create("")).toThrow("Tag name cannot be empty");
    expect(() => TagName.create("   ")).toThrow("Tag name cannot be empty");
  });

  it("should throw error for too long name", () => {
    const longName = "a".repeat(51);
    expect(() => TagName.create(longName)).toThrow(
      "Tag name cannot exceed 50 characters"
    );
  });

  it("should be immutable", () => {
    const tagName = TagName.create("Test Tag");
    const originalValue = tagName.getValue();

    expect(() => {
      (tagName as any).value = "Changed Name";
    }).toThrow(TypeError); // Object.freeze rend l'objet immuable

    expect(tagName.getValue()).toBe(originalValue);
  });
});
