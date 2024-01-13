import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedService } from '../shared.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  /**
   * Este metodo static nos permite devolver modulos dinamicos para
   * el registro de un microservicio con rabbitmq. En este caso esta
   * en el modulo Shared debido a que este es compartido entre los
   * microservicios y esto nos permite usar el mismo modelo y metodo
   * para el registro de todos los microservicios. Aunque esto
   * tambien podria ser creado dentro del servicio de la API-GATEWAY
   *
   * En caso de que no usaramos este metodo, toda la configuracion
   * que esta dentro del mismo tendria que ir dentro de los imports
   * de la api-gateway por cada microservicio que resgistremos para
   * rabbitmq
   */
  public static registerRmq({
    service,
    queue,
  }: {
    service: string;
    queue: string;
  }): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          const USER = configService.get('RABBITMQ_USER');
          const PASSWORD = configService.get('RABBITMQ_PASS');
          const HOST = configService.get('RABBITMQ_HOST');

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue,
              queueOptions: {
                durable: true,
              },
            },
          });
        },
        inject: [ConfigService],
      },
    ];

    return {
      module: SharedModule,
      providers,
      exports: providers,
    };
  }
}
