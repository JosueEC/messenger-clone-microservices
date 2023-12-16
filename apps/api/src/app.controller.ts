import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  /**
   * En el constructor de nuestro controlador podemos inyectar los
   * microservicios para hacer uso de ellos, tales como si fueran
   * un service de nuestra aplicacion. Estos se identifican por el
   * nombre que le dimos en la configuracion de conexion en el
   * app.module
   */
  constructor(
    @Inject('AUTH_SERVICE')
    private authService: ClientProxy,
  ) {}

  /**
   * Para enviar una request a un microservicios, solo hay que hacer
   * uso de la funcion .send(). Esta recibe el comando(cmd) al que se
   * debe hacer match en el microservicio y como segundo parametro
   * se envia informacion al mismo.
   */
  @Post('auth')
  async postUser() {
    return this.authService.send(
      {
        cmd: 'post-user',
      },
      {},
    );
  }

  @Get('auth')
  async getUsers() {
    return this.authService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }
}
