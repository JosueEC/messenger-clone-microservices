import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

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
  @MessagePattern({ cmd: 'get-user' })
  public async getUser(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return { user: 'USER' };
  }
}
