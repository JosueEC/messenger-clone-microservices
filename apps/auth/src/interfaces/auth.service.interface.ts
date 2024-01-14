import { UserEntity } from '../entity/user.entity';
import { LoginUserDto } from '../dto/login-user.dto';
import { NewUserDto } from '../dto/new-user.dto';

export interface AuthServiceInterface {
  findUsers(): Promise<Array<UserEntity>>;
  findByEmail(email: string): Promise<UserEntity>;
  hashPassword(password: string): Promise<string>;
  doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean>;
  validateUser(email: string, password: string): Promise<UserEntity>;
  registerUser(payload: Readonly<NewUserDto>): Promise<UserEntity>;
  loginUser(payload: Readonly<LoginUserDto>): Promise<object>;
  verifyJwt(jwt: string): Promise<{ exp: number }>;
}
