import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@app/shared';

@Module({
  /**
   * En este modulo principal es donde podemos agregar la configuracion
   * al modulo config de NestJS. El envFilePath es para poder pasarle
   * las variables de entorno y poder accederlas desde cualquier parte
   * de la aplicacion ya que el modulo app es global
   */
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    /**
     * Podemos crear un modulo, en el cual creamos un metodo static
     * en la clase, el cual nos permitira registrar los modulos de
     * microservicios de forma dinamica. Esto vuelve mas legible el
     * codigo y se satura menos el registro de microservicios en el
     * modulo de la API-GATEWAY
     */
    SharedModule.registerRmq({
      service: 'AUTH_SERVICE',
      queue: process.env.RABBITMQ_AUTH_QUEUE,
    }),
    SharedModule.registerRmq({
      service: 'PRESENCE_SERVICE',
      queue: process.env.RABBITMQ_PRESENCE_QUEUE,
    }),
  ],
  controllers: [AppController],
  /**
   * En el caso de la API GATEWAY los microservicios deben ser
   * registrados en el modulo de providers. Estos se pasan como un
   * objeto, el cual contiene el mobre del microservicio(provide) y
   * la funcion useFactory, la cual devuelve una conexion con RabbitMQ
   * en este caso.
   *
   * Basicamente es lo mismo que se establecio para conectar el
   * microservicio de auth en su respectivo archivo main.ts. Solo
   * cambia la configuracion y ubicacion, debido a que este es el
   * generador/emisor y auth es el consumidor
   */
  providers: [AppService],
})
export class AppModule {}
