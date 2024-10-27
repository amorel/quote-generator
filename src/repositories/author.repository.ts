import { Author } from '../types/author';
import { authors } from '../data/authors';

export interface IAuthorRepository {
  findAll(): Promise<Author[]>;
  findById(id: string): Promise<Author | null>;
}

export class AuthorRepository implements IAuthorRepository {
  async findAll(): Promise<Author[]> {
    return authors;
  }

  async findById(id: string): Promise<Author | null> {
    return authors.find(author => author._id === id) || null;
  }
}