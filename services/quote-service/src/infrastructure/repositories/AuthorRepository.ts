// repositories/AuthorRepository.ts
import { Author } from "../../domain/entities/Author";
import { IAuthorRepository } from "../../domain/repositories/IAuthorRepository";
import { AuthorModel } from "../persistence/models/AuthorModel";
import AuthorName from "../../domain/value-objects/AuthorName";

export class AuthorRepository implements IAuthorRepository {
  async findAll(): Promise<Author[]> {
    try {
      const authors = await AuthorModel.find();
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
    } catch (error) {
      console.error("Error in AuthorRepository.findAll:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Author | null> {
    try {
      const author = await AuthorModel.findById(id);
      if (!author) return null;

      return new Author(
        author._id,
        AuthorName.create(author.name),
        author.link,
        author.bio,
        author.description
      );
    } catch (error) {
      console.error("Error in AuthorRepository.findById:", error);
      throw error;
    }
  }
}
