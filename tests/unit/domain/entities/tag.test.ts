import { Tag } from "../../../../src/domain/entities/Tag";
import TagName from "../../../../src/domain/value-objects/TagName";

describe("Tag Entity", () => {
  const mockTag = new Tag("test-id", TagName.create("Test Tag"));

  it("should create a tag with valid data", () => {
    expect(mockTag.getId()).toBe("test-id");
    expect(mockTag.getName().getValue()).toBe("Test Tag");
  });

  it("should maintain value object immutability", () => {
    const tagName = mockTag.getName();
    const originalValue = tagName.getValue();

    // Try to modify the internal value
    try {
      (tagName as any).value = "Changed Name";
    } catch (e) {
      // Some environments might throw on attempted modification of frozen object
    }

    expect(tagName.getValue()).toBe(originalValue);
  });
});
