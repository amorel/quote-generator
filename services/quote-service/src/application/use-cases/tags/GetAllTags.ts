import { ITagRepository } from "../../../domain/repositories/ITagRepository";
import { TagPresenter } from "../../../interface/api/presenters/TagPresenter";
import { TagDTO } from "../../dtos/TagDTO";

export class GetAllTagsUseCase {
  constructor(
    private readonly tagRepository: ITagRepository,
    private readonly tagPresenter: TagPresenter
  ) {}

  async execute(): Promise<TagDTO[]> {
    const tags = await this.tagRepository.findAll();
    return tags.map((tag) => this.tagPresenter.toDTO(tag));
  }
}
