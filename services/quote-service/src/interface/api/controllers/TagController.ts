import { FastifyRequest, FastifyReply } from "fastify";
import { GetAllTagsUseCase } from "../../../application/use-cases/tags/GetAllTags";
import { GetTagByIdUseCase } from "../../../application/use-cases/tags/GetTagById";
import { NotFoundError } from "../../errors";

export class TagController {
  constructor(
    private readonly getAllTagsUseCase: GetAllTagsUseCase,
    private readonly getTagByIdUseCase: GetTagByIdUseCase
  ) {}

  async getAllTags(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.log("TagController: Getting all tags");
      const tags = await this.getAllTagsUseCase.execute();
      console.log("TagController: Tags retrieved:", tags?.length);
      return tags;
    } catch (error) {
      console.error("TagController error:", error);
      throw error;
    }
  }

  async getTagById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      console.log("📝 [TagController] Request params:", request.params);
      const tag = await this.getTagByIdUseCase.execute(request.params.id);
      console.log("📦 [TagController] Use case result:", tag);
      const response = {
        id: tag.id,
        name: tag.name,
      };
      console.log("📤 [TagController] Sending response:", response);
      return reply.send(response);
    } catch (error) {
      console.error("❌ [TagController] Error:", error);
      if (error instanceof NotFoundError) {
        return reply.status(404).send({
          status: "error",
          message: error.message,
        });
      }
      return reply.status(500).send({
        status: "error",
        message: "Internal server error",
      });
    }
  }
}
