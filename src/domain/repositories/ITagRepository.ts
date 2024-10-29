import { Tag } from "../entities/Tag";

export interface ITagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: string): Promise<Tag | null>;
}
