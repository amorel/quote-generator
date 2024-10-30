import { Author } from "../../../../src/domain/entities/Author";
import AuthorName from "../../../../src/domain/value-objects/AuthorName";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("Author Entity", () => {
  const mockAuthor = new Author(
    "test-id",
    AuthorName.create("Test Author"),
    "https://example.com",
    "Test bio",
    "Test description"
  );

  it("should create an author with valid data", () => {
    expect(mockAuthor.getId()).toBe("test-id");
    expect(mockAuthor.getName().getValue()).toBe("Test Author");
    expect(mockAuthor.getLink()).toBe("https://example.com");
    expect(mockAuthor.getBio()).toBe("Test bio");
    expect(mockAuthor.getDescription()).toBe("Test description");
  });

  it("should allow undefined link", () => {
    const authorWithoutLink = new Author(
      "test-id",
      AuthorName.create("Test Author"),
      undefined,
      "Test bio",
      "Test description"
    );

    expect(authorWithoutLink.getLink()).toBeUndefined();
  });
});
