import { Tag } from "../../domain/entities/Tag";
import { ITagRepository } from "../../domain/repositories/ITagRepository";
import { TagModel } from "../persistence/models/TagModel";
import TagName from "../../domain/value-objects/TagName";

export class TagRepository implements ITagRepository {
  async findAll(): Promise<Tag[]> {
    try {
      const tags = await TagModel.find();
      return tags.map((tag) => new Tag(tag._id, TagName.create(tag.name)));
    } catch (error) {
      console.error("Error in TagRepository.findAll:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Tag | null> {
    try {
      console.log("🔍 [TagRepository] Looking for tag with id:", id);
      const tag = await TagModel.findById(id);
      console.log("📦 [TagRepository] Found tag:", tag);
      if (!tag) return null;

      const tagEntity = new Tag(tag._id, TagName.create(tag.name));
      console.log("🎯 [TagRepository] Returning entity:", tagEntity);
      return tagEntity;
    } catch (error) {
      console.error("❌ [TagRepository] Error:", error);
      throw error;
    }
  }
}
