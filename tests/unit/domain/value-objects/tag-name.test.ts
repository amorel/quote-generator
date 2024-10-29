import TagName from "../../../../src/domain/value-objects/TagName";

describe("TagName", () => {
  it("should create valid tag name", () => {
    const name = "Test Tag";
    const tagName = TagName.create(name);
    expect(tagName.getValue()).toBe(name);
  });

  it("should throw error for empty name", () => {
    expect(() => TagName.create("")).toThrow();
  });

  it("should throw error for name exceeding max length", () => {
    const longName = "a".repeat(51); // Assuming max length is 50
    expect(() => TagName.create(longName)).toThrow();
  });
});
