import { IAuthorRepository } from "../../../domain/repositories/IAuthorRepository";
import { AuthorDTO } from "../../dtos/AuthorDTO";
import { NotFoundError } from "../../../interface/errors";
import { AuthorPresenter } from "../../../interface/api/presenters/AuthorPresenter";

export class GetAuthorByIdUseCase {
  constructor(
    private readonly authorRepository: IAuthorRepository,
    private readonly authorPresenter: AuthorPresenter
  ) {}

  async execute(id: string): Promise<AuthorDTO> {
    const author = await this.authorRepository.findById(id);
    if (!author) {
      throw new NotFoundError(`Author with ID ${id} not found`);
    }
    return this.authorPresenter.toDTO(author);
  }
}
