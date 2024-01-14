import { UserEntity } from 'apps/auth/src/entity/user.entity';
import { BaseInterfaceRepository } from '../repositories/base/base.interface.repository';

export interface UserRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {}
