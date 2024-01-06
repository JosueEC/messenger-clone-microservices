import { Controller, UseGuards } from '@nestjs/common';
import {
  MessagePattern,
  Ctx,
  RmqContext,
  Payload,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { UserEntity } from './entity/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SharedService } from '@app/shared';
import { NewUserDto } from './dto/new-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtGuard } from './jwt/jwt.guard';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sharedService: SharedService,
  ) {}

  /**
   * En el caso de los microservicios consumidores, usamos el
   * decorador @MessagePattern Este decorador actua como si fuera
   * un verbo HTTP en el controlador. En este caso, la aplicacion
   * api-gateway vendra al controlador y buscara el cmd con el cual
   * matchee la request que se esta manejando y entonces ejecutara
   * el codigo asociado.
   *
   * Las funciones asociadas a los MessagePattern reciben el contexto
   * de la peticion. Dependiendo de que message broker estamos usando
   * es como podemos tipar el contexto. En este caso es de tipo
   * RmqContext el cual es de RabbitMQ.
   *
   * De este context podemos obtener el channel y el message de la
   * request
   */
  @MessagePattern({ cmd: 'get-users' })
  public async getUsers(
    @Ctx() context: RmqContext,
  ): Promise<Array<UserEntity>> {
    /**
     * const channel = context.getChannelRef();
     * const message = context.getMessage();
     * channel.ack(message);
     *
     * Lo anterior, es la forma en la que notificamos a RabbitMQ de
     * la recpecion de un nuevo mensaje.
     *
     * Dado que creamos una funcion que hace este proceso en el modulo
     * lib/ especificacmente en su archivo shared.service, entonces
     * solo basta inyectar ese servicio y hacer uso de la funcion,
     * quedando de la siguiente forma:
     */
    this.sharedService.acknowledgeMessage(context);
    return this.authService.findUsers();
  }

  @MessagePattern({ cmd: 'update-user' })
  public async updateUser(@Ctx() context: RmqContext): Promise<UpdateResult> {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.updateUser();
  }

  @MessagePattern({ cmd: 'delete-user' })
  public async deleteUser(@Ctx() context: RmqContext): Promise<DeleteResult> {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.deleteUser();
  }

  /**
   * @Payload es eldecorador que nos permite recuperar informacion en
   * las peticiones a traves de microservicios, podemos usar un objeto
   * DTO para englobar esta carga util y asi poder recuperar la
   * informacion que fue enviada a este endpoint de este microservicio
   */
  @MessagePattern({ cmd: 'register' })
  public async registerUser(
    @Ctx() context: RmqContext,
    @Payload() payload: NewUserDto,
  ): Promise<UserEntity> {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.registerUser(payload);
  }

  @MessagePattern({ cmd: 'login' })
  public async loginUser(
    @Ctx() context: RmqContext,
    @Payload() payload: LoginUserDto,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.loginUser(payload);
  }

  @MessagePattern({ cmd: 'verify-token' })
  @UseGuards(JwtGuard)
  public async verifyToken(
    @Ctx() context: RmqContext,
    @Payload() payload: LoginUserDto,
  ) {
    this.sharedService.acknowledgeMessage(context);
    return this.authService.loginUser(payload);
  }
}
