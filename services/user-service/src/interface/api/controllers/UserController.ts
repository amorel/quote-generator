import { FastifyRequest, FastifyReply } from 'fastify';
import { GetAllUsersUseCase } from '../../../application/use-cases/users/GetAllUsers';

export class UserController {
  constructor(private getAllUsersUseCase: GetAllUsersUseCase) {}

  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.getAllUsersUseCase.execute();
    return reply.send(users);
  }
}