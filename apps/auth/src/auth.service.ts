import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entity/user.entity';
import { NewUserDto } from './dto/new-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRepositoryInterface } from '@app/shared/interfaces/users.repository.interface';
import { AuthServiceInterface } from './interfaces/auth.service.interface';

/**
 * Observa que, la libreria de bcrypt se importa como un modulo en
 * nuestra clase service, mientras que JWT se inyecta como un
 * servicio al importar la clase JwtService del modulo jwt
 */
@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    /**
     * Usando el decoradot @InjectRepository y la clase Repository
     * de typeorm podemos acceder a los metodos para comunicarnos
     * con la base de datos de esta forma:
     * * @InjectRepository(UserEntity)
     * * private readonly userRepository: Repository<UserEntity>,
     *
     * Pero, para este caso, estamos implementando el Abstract
     * Repository, por lo que, la forma de injectar el repository
     * es diferente.
     *
     * Como puedes ver, ahora se usa el decorador @Inject ya que
     * estamos inyectando la interface UserRepository la cual
     * implementa el Abstract Repository
     *
     * Mencionar que estas interfaces fueron inyectadas en el
     * auth.module para que el modulo tenga conocimiento de las
     * mismas.
     */
    @Inject('UsersRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  public async findUsers(): Promise<Array<UserEntity>> {
    return this.userRepository.findAll();
  }

  /**
   * * select
   * Nos permite sobreescribir que parametros deseamos que sean
   * devueltos en la consulta, esto sobreescribe la propiedad
   * select: false en la entidad UserEntity, por lo tanto, esta
   * funcion si nos devuelve la password, ya que esta, sera necesaria.
   */
  public async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByCondition({
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

  public async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.findByEmail(email);

    /**
     * La razon de retornar null en las validaciones, es porque
     * las excpeciones se lanzan en la funcion loginUser dependiendo
     * de si esta funcion devuelve el objeto user o el valor null
     * segun la evaluacion
     */
    if (!user) return null;

    const matchPasswords = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!matchPasswords) return null;

    return user;
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

  public async loginUser(payload: Readonly<LoginUserDto>): Promise<object> {
    const { email, password } = payload;

    const user = await this.validateUser(email, password);

    if (!user) throw new UnauthorizedException('Bad credentials');

    /**
     * Esta funcion, lo que hace es hashear la informacion que le
     * pasemos en el payload de nuestro JWT, de esta forma, la
     * informacion de sesion se devuelve hasheada y el cliente puede
     * descifrarla cuando sea necesario
     */
    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt };
  }

  /**
   * Aqui tenemos otra forma de añadir tipado en TypeScript, el
   * cual es poner directamente el contenido de un objeto.
   */
  public async verifyJwt(jwt: string): Promise<{ exp: number }> {
    if (!jwt) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      /**
       * El valor 'exp' es la fecha de expiracion del token
       * verificado, esto es lo que vamos a devolver al cliente.
       */
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new UnauthorizedException(
        'Something went wrong with the verify token',
      );
    }
  }

  // TODO: Definir los metodos update and delete en el Abstract Repository
  // public async updateUser(): Promise<UpdateResult> {
  //   return this.userRepository.update({ id: 1 }, { firstName: 'Josue Cruz' });
  // }

  // public async deleteUser(): Promise<UserEntity> {
  //   return this.userRepository.remove({ id: 1 });
  // }
}
