import { TagRepository } from "../../../../src/infrastructure/repositories/TagRepository";
import { Tag } from "../../../../src/domain/entities/Tag";

describe("TagRepository", () => {
  let repository: TagRepository;

  beforeEach(() => {
    repository = new TagRepository();
  });

  describe("findAll", () => {
    it("should return all tags", async () => {
      const tags = await repository.findAll();
      expect(tags.length).toBeGreaterThan(0);
      tags.forEach((tag) => {
        expect(tag).toBeInstanceOf(Tag);
      });
    });
  });

  describe("findById", () => {
    it("should find tag by id", async () => {
      const tags = await repository.findAll();
      const firstTag = tags[0];
      const foundTag = await repository.findById(firstTag.getId());

      expect(foundTag).not.toBeNull();
      expect(foundTag?.getId()).toBe(firstTag.getId());
    });

    it("should return null for non-existent id", async () => {
      const tag = await repository.findById("non-existent-id");
      expect(tag).toBeNull();
    });
  });
});
