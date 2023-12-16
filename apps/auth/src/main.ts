import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  /**
   * Esta es una forma en la que podemos acceder a las variables de
   * entorno desde el modulo de configuracion de NestJS, para esto
   * debimos haber proporcionado la ruta el archivo .env en el
   * app.module de nuestro microservicio
   */
  const configService = app.get(ConfigService);
  /**
   * Esta es la forma en la que refactorizamos el codigo de conexion
   * del microservicio con rabbitmq. Obtenemos el servicio y la queue
   * y usamos ambos para obtener los MicroserviceOptions
   *
   * De lo contrario tendriamos aqui todo el codigo que esta definido
   * en el metodo .getRmqOptions() por cada microservicio conectado
   * a RabbitMQ
   */
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions(queue),
  );

  /**
   * A diferencia de una API normal, la cual se levanta con el
   * app.listen, los microservicios se levantan con la instruccion
   * app.startAllMicroservices
   */
  app.startAllMicroservices();
}
bootstrap();
