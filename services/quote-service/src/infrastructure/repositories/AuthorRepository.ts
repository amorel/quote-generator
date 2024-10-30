import { Author } from "../../domain/entities/Author";
import { IAuthorRepository } from "../../domain/repositories/IAuthorRepository";
import { authors } from "../persistence/in-memory/authors";
import AuthorName from "../../domain/value-objects/AuthorName";

export class AuthorRepository implements IAuthorRepository {
  async findAll(): Promise<Author[]> {
    return authors.map(
      (author) =>
        new Author(
          author._id,
          AuthorName.create(author.name),
          author.link,
          author.bio,
          author.description
        )
    );
  }

  async findById(id: string): Promise<Author | null> {
    const author = authors.find((a) => a._id === id);
    if (!author) return null;

    return new Author(
      author._id,
      AuthorName.create(author.name),
      author.link,
      author.bio,
      author.description
    );
  }
}
