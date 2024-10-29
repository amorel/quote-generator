import { Tag } from "../../../domain/entities/Tag";
import { TagDTO } from "../../../application/dtos/TagDTO";

export class TagPresenter {
  toDTO(tag: Tag): TagDTO {
    return {
      id: tag.getId(),
      name: tag.getName().getValue(),
    };
  }
}
