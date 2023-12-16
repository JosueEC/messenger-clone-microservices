import { Controller } from '@nestjs/common';
import { MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { UserEntity } from './entity/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.findUsers();
  }

  @MessagePattern({ cmd: 'post-user' })
  public async postUser(@Ctx() context: RmqContext): Promise<UserEntity> {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.saveUser();
  }

  @MessagePattern({ cmd: 'update-user' })
  public async updateUser(@Ctx() context: RmqContext): Promise<UpdateResult> {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.updateUser();
  }

  @MessagePattern({ cmd: 'delete-user' })
  public async deleteUser(@Ctx() context: RmqContext): Promise<DeleteResult> {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.deleteUser();
  }
}
