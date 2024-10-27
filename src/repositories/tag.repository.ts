import { tags } from "../data/tags";
import { Tag } from "../types/tag";

export interface ITagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: string): Promise<Tag | null>;
}

export class TagRepository implements ITagRepository {
  async findAll(): Promise<Tag[]> {
    return tags;
  }

  async findById(id: string): Promise<Tag | null> {
    return tags.find((tag) => tag._id === id) || null;
  }
}
