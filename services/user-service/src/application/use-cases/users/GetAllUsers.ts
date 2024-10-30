import { UserPresenter } from "interface/api/presenters/UserPresenter";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class GetAllUsersUseCase {
  constructor(
    private userRepository: IUserRepository,
    private userPresenter: UserPresenter
  ) {}

  async execute() {
    const users = await this.userRepository.findAll();
    return this.userPresenter.presentMany(users);
  }
}
