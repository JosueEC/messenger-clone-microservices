import { ConflictException, Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { NewUserDto } from './dto/new-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findUsers(): Promise<Array<UserEntity>> {
    return this.userRepository.find();
  }

  /**
   * * select
   * Nos permite sobreescribir que parametros deseamos que sean
   * devueltos en la consulta, esto sobreescribe la propiedad
   * select: false en la entidad UserEntity, por lo tanto, esta
   * funcion si nos devuelve la password, ya que esta, sera necesaria.
   */
  public async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  /**
   * El numero que se pasa como parametro en la funcion .hash es el
   * numero de veces que se hashea la contraseña recibida como primer
   * parametro
   */
  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * * Readonly<>
   * Nos permite indicar que, para el objeto que se esta recibiendo
   * se pueden leer/acceder a sus propiedades, pero estas no pueden
   * ser mutadas/modificadas.
   */
  public async registerUser(
    payload: Readonly<NewUserDto>,
  ): Promise<UserEntity> {
    const { firstName, lastName, email, password } = payload;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('An account with that email already exist');
    }

    const hashedPassword = await this.hashPassword(password);

    const savedUser = await this.userRepository.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    delete savedUser.password;
    return savedUser;
  }

  public async updateUser(): Promise<UpdateResult> {
    return this.userRepository.update({ id: 1 }, { firstName: 'Josue Cruz' });
  }

  public async deleteUser(): Promise<DeleteResult> {
    return this.userRepository.delete({ id: 1 });
  }
}
