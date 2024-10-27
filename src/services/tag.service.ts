import { Tag } from "../types/tag";
import { ITagRepository } from "../repositories/tag.repository";
import { NotFoundError } from "../errors";

export class TagService {
  constructor(private repository: ITagRepository) {}

  async getAllTags(): Promise<Tag[]> {
    return this.repository.findAll();
  }

  async getTagById(id: string): Promise<Tag> {
    const tag = await this.repository.findById(id);
    if (!tag) {
      throw new NotFoundError(`Tag avec l'ID ${id} non trouvé`);
    }
    return tag;
  }
}
