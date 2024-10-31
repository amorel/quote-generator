import { User } from "@/domain/entities/User";
import { IUserRepository } from "@/domain/repositories/IUserRepository";

export class UserRepositoryMock implements IUserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.getEmail() === email) || null;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  // Méthode helper pour les tests
  clear() {
    this.users = [];
  }
}
