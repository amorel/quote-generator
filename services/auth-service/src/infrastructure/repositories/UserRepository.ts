import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserModel, IUserDocument } from '../persistence/models/UserModel';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email }) as IUserDocument | null;
    if (!userDoc) return null;

    return new User(
      userDoc._id.toString(),
      userDoc.email,
      userDoc.password,
      userDoc.role
    );
  }

  async create(user: User): Promise<User> {
    const userDoc = await UserModel.create({
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole()
    }) as IUserDocument;

    return new User(
      userDoc._id.toString(),
      userDoc.email,
      userDoc.password,
      userDoc.role
    );
  }
}