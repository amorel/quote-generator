import { Author } from '../types/author';
import { IAuthorRepository } from '../repositories/author.repository';
import { NotFoundError } from '../errors';

export class AuthorService {
  constructor(private repository: IAuthorRepository) {}

  async getAllAuthors(): Promise<Author[]> {
    return this.repository.findAll();
  }

  async getAuthorById(id: string): Promise<Author> {
    const author = await this.repository.findById(id);
    if (!author) {
      throw new NotFoundError(`Auteur avec l'ID ${id} non trouvé`);
    }
    return author;
  }
}