import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findUsers(): Promise<Array<UserEntity>> {
    return this.userRepository.find();
  }

  public async saveUser(): Promise<UserEntity> {
    return this.userRepository.save({ name: 'Josue' });
  }

  public async updateUser(): Promise<UpdateResult> {
    return this.userRepository.update({ id: 1 }, { name: 'Josue Cruz' });
  }

  public async deleteUser(): Promise<DeleteResult> {
    return this.userRepository.delete({ id: 1 });
  }
}
