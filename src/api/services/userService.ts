import { UserModel } from '@/api/models/userModel';
import { User, UpdateUserDTO } from '@/api/types/user';

export class UserService {
  static async getUser(id: string): Promise<User> {
    if (!id) {
      throw new Error('Invalid user id');
    }

    return UserModel.find(id);
  }

  static async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    if (!id) {
      throw new Error('Invalid user id');
    }

    if (data.email && !data.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    return UserModel.update(id, data);
  }
}
