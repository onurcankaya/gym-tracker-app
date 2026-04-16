import { UserModel } from '@/api/models/userModel';
import { User, UpdateUserDTO } from '@/api/types/user';

export class UserService {
  static async getUser(id: string): Promise<User> {
    if (!id) {
      throw new Error('Invalid user id');
    }

    return UserModel.findById(id);
  }

  static async getUserId(email: string): Promise<User['email']> {
    if (!email) {
      throw new Error('Invalid user email');
    }

    return UserModel.findByEmail(email);
  }

  static async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    if (!id) {
      throw new Error('Invalid user id');
    }

    if (data.name !== undefined && data.name.length === 0) {
      throw new Error('Invalid name');
    }

    if (data.email && !data.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    return UserModel.update(id, data);
  }
}
