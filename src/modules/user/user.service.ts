import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async find(): Promise<User[]> {
    try {
      const user = await this.userRepository.find({
        relations: {
          wallets: true,
        },
        select: {
          nonce: false,
          wallets: {
            userId: false,
          },
        },
      });
      return user;
    } catch {
      // ignore
    }

    return [];
  }

  async findById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { id },
        relations: ['wallets'],
      });

      return user;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }
}
