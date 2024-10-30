import { Author } from "../../../domain/entities/Author";
import { AuthorDTO } from "../../../application/dtos/AuthorDTO";

export class AuthorPresenter {
  toDTO(author: Author): AuthorDTO {
    return {
      id: author.getId(),
      name: author.getName().getValue(),
      link: author.getLink(),
      bio: author.getBio(),
      description: author.getDescription(),
    };
  }
}
