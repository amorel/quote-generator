import { AuthorRepository } from "../../../../src/infrastructure/repositories/AuthorRepository";
import { Author } from "../../../../src/domain/entities/Author";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("AuthorRepository", () => {
  let repository: AuthorRepository;

  beforeEach(() => {
    repository = new AuthorRepository();
  });

  describe("findAll", () => {
    it("should return all authors", async () => {
      const authors = await repository.findAll();
      expect(authors.length).toBeGreaterThan(0);
      authors.forEach((author) => {
        expect(author).toBeInstanceOf(Author);
      });
    });
  });

  describe("findById", () => {
    it("should find author by id", async () => {
      const authors = await repository.findAll();
      const firstAuthor = authors[0];
      const foundAuthor = await repository.findById(firstAuthor.getId());

      expect(foundAuthor).not.toBeNull();
      expect(foundAuthor?.getId()).toBe(firstAuthor.getId());
    });

    it("should return null for non-existent id", async () => {
      const author = await repository.findById("non-existent-id");
      expect(author).toBeNull();
    });
  });
});
