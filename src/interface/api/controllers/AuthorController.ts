import { FastifyRequest, FastifyReply } from "fastify";
import { GetAllAuthorsUseCase } from "../../../application/use-cases/authors/GetAllAuthors";
import { GetAuthorByIdUseCase } from "../../../application/use-cases/authors/GetAuthorById";
import { NotFoundError } from "../../../errors";

export class AuthorController {
  constructor(
    private readonly getAllAuthorsUseCase: GetAllAuthorsUseCase,
    private readonly getAuthorByIdUseCase: GetAuthorByIdUseCase
  ) {}

  async getAllAuthors(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authors = await this.getAllAuthorsUseCase.execute();
      reply.send(authors);
      return authors;
    } catch (error) {
      return reply.status(500).send({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  async getAuthorById(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const author = await this.getAuthorByIdUseCase.execute(request.params.id);
      return reply.send(author);
    } catch (error) {
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
