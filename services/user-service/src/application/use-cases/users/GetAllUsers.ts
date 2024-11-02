// Corriger l'import avec un chemin relatif
import { UserPresenter } from "../../../interface/api/presenters/UserPresenter";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";

export class GetAllUsersUseCase {
  constructor(
    private userRepository: IUserRepository,
    private userPresenter: UserPresenter
  ) {}

  async execute() {
    const users = await this.userRepository.getAll();
    return this.userPresenter.presentMany(users);
  }
}