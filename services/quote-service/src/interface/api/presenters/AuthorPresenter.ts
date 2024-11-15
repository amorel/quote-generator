import { Author } from "../../../domain/entities/Author";
import { AuthorDTO } from "../../../application/dtos/AuthorDTO";

export class AuthorPresenter {
  public toDTO(author: Author): AuthorDTO {
    return {
      id: author.getId(),
      name: author.getName().getValue(),
      bio: author.getBio(),
      description: author.getDescription(),
      link: author.getLink(),
    };
  }
}
