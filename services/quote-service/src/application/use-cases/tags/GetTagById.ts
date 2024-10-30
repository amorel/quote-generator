import { ITagRepository } from "../../../domain/repositories/ITagRepository";
import { TagDTO } from "../../dtos/TagDTO";
import { NotFoundError } from "../../../interface/errors";
import { TagPresenter } from "../../../interface/api/presenters/TagPresenter";

export class GetTagByIdUseCase {
  constructor(
    private readonly tagRepository: ITagRepository,
    private readonly tagPresenter: TagPresenter
  ) {}

  async execute(id: string): Promise<TagDTO> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundError(`Tag with ID ${id} not found`);
    }
    return this.tagPresenter.toDTO(tag);
  }
}
