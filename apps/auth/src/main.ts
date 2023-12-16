import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  /**
   * Esta es una forma en la que podemos acceder a las variables de
   * entorno desde el modulo de configuracion de NestJS, para esto
   * debimos haber proporcionado la ruta el archivo .env en el
   * app.module de nuestro microservicio
   */
  const configService = app.get(ConfigService);
  const USER = configService.get('RABBITMQ_USER');
  const PASSWORD = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  /**
   * Debemos definir las variables de configuracion para el
   * microservicio. Esto se logra con la funcion connectMicroservice.
   *
   * Esta funcion recibe un objeto de tipo MicroserviceOptions, el
   * cual contiene la capa de transporte, la url de conexion con la
   * capa de transport (RabbitMQ en este caso).
   *
   * El noAck es cuando el consumidor recibe el mensaje y este notifica
   * de recibido (acuse de recibo), de esta forma lo dejamos de forma
   * automatica para no tener que hacerlo manual.
   *
   * La queue es el nombre que definimos en las variables de entorno.
   * Esta queue es la que almacenar las peticiones recibidas de la
   * api-gateway y las cuales van dirigidas a este microservicio.
   *
   * Con la queue podemos pasar las queueOptions, las cuales pueden
   * definir el comportamiento de la queue de rabbitmq para este
   * microservicio: durable establece si la request en la queue deben
   * de persistir en caso de un reinicio del servicio
   */
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck: false,
      queue: QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  /**
   * A diferencia de una API normal, la cual se levanta con el
   * app.listen, los microservicios se levantan con la instruccion
   * app.startAllMicroservices
   */
  app.startAllMicroservices();
}
bootstrap();
