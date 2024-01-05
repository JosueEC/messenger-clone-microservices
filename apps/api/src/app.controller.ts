import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

/**
 * El controlador de la API-GATEWAY es el que se comunica con todos
 * los microservicios que se han registrado en su modulo, por lo
 * tanto, aqui se registran todos los endpoints para cada
 * microservicio.
 *
 * PSDT: Investigar si se usa alguna forma de separar estos endpoints
 * para no saturar el controlador del API-GATEWAY
 */
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
    @Inject('PRESENCE_SERVICE')
    private presenceService: ClientProxy,
  ) {}

  /**
   * Para enviar una request a un microservicios, solo hay que hacer
   * uso de la funcion .send(). Esta recibe el comando(cmd) al que se
   * debe hacer match en el microservicio y como segundo parametro
   * se envia informacion al mismo.
   */
  @Post('auth')
  public async postUser() {
    return this.authService.send(
      {
        cmd: 'post-user',
      },
      {},
    );
  }

  @Get('auth')
  public async getUsers() {
    return this.authService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }

  @Get('presence')
  public async getPresence() {
    return this.presenceService.send(
      {
        cmd: 'get-presence',
      },
      {},
    );
  }

  @Post('auth/register')
  public async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.send(
      {
        cmd: 'register',
      },
      {
        firstName,
        lastName,
        email,
        password,
      },
    );
  }
}
