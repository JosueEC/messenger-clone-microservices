import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  providers: [
    AppService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const USER = configService.get('RABBITMQ_USER');
        const PASSWORD = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
            queue: QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
