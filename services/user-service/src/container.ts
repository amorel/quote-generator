import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { UserPresenter } from "./interface/api/presenters/UserPresenter";
import { GetAllUsersUseCase } from "./application/use-cases/users/GetAllUsers";
import { UserController } from "./interface/api/controllers/UserController";

export class Container {
  private static instance: Container;
  private services = new Map();

  private constructor() {
    const userRepository = new UserRepository();
    const userPresenter = new UserPresenter();
    const getAllUsersUseCase = new GetAllUsersUseCase(
      userRepository,
      userPresenter
    );
    const userController = new UserController(getAllUsersUseCase);

    this.services.set("userController", userController);
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) throw new Error(`Service ${serviceName} not found`);
    return service as T;
  }
}
