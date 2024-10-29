import { IAuthorRepository } from "../../../domain/repositories/IAuthorRepository";
import { AuthorPresenter } from "../../../interface/api/presenters/AuthorPresenter";
import { AuthorDTO } from "../../dtos/AuthorDTO";

export class GetAllAuthorsUseCase {
  constructor(
    private readonly authorRepository: IAuthorRepository,
    private readonly authorPresenter: AuthorPresenter
  ) {}

  async execute(): Promise<AuthorDTO[]> {
    const authors = await this.authorRepository.findAll();
    return authors.map((author) => this.authorPresenter.toDTO(author));
  }
}
