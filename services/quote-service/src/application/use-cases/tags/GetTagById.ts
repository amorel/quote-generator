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
    console.log("🔄 [GetTagByIdUseCase] Starting with id:", id);
    const tag = await this.tagRepository.findById(id);
    console.log("📥 [GetTagByIdUseCase] Received from repository:", tag);

    if (!tag) {
      console.log("❌ [GetTagByIdUseCase] Tag not found");
      throw new NotFoundError(`Tag with ID ${id} not found`);
    }

    const dto = this.tagPresenter.toDTO(tag);
    console.log("📤 [GetTagByIdUseCase] Converted to DTO:", dto);
    return dto;
  }
}
