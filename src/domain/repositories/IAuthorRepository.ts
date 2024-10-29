import { Author } from "../entities/Author";

export interface IAuthorRepository {
  findAll(): Promise<Author[]>;
  findById(id: string): Promise<Author | null>;
}
