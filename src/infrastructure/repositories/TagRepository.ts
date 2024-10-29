// src/infrastructure/repositories/TagRepository.ts
import { Tag } from "../../domain/entities/Tag";
import { ITagRepository } from "../../domain/repositories/ITagRepository";
import { tags } from "../persistence/in-memory/tags";
import TagName from "../../domain/value-objects/TagName";

export class TagRepository implements ITagRepository {
  async findAll(): Promise<Tag[]> {
    return tags.map((tag) => new Tag(tag._id, TagName.create(tag.name)));
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = tags.find((t) => t._id === id);
    if (!tag) return null;

    return new Tag(tag._id, TagName.create(tag.name));
  }
}
