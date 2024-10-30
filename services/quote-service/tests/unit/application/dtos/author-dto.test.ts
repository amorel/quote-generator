import { AuthorDTO } from "../../../../src/application/dtos/AuthorDTO";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("AuthorDTO", () => {
  it("should have correct structure", () => {
    const authorDTO: AuthorDTO = {
      id: "test-id",
      name: "Test Author",
      link: "https://example.com",
      bio: "Test bio",
      description: "Test description",
    };

    expect(authorDTO).toHaveProperty("id");
    expect(authorDTO).toHaveProperty("name");
    expect(authorDTO).toHaveProperty("link");
    expect(authorDTO).toHaveProperty("bio");
    expect(authorDTO).toHaveProperty("description");
  });

  it("should allow optional link", () => {
    const authorDTO: AuthorDTO = {
      id: "test-id",
      name: "Test Author",
      bio: "Test bio",
      description: "Test description",
    };

    expect(authorDTO.link).toBeUndefined();
  });
});
