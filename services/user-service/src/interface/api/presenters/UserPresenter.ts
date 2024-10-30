import { User } from "../../../domain/entities/User";

export class UserPresenter {
  presentOne(user: User) {
    return {
      id: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
    };
  }

  presentMany(users: User[]) {
    return users.map((user) => this.presentOne(user));
  }
}
