import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { SharedServiceInterface } from './interfaces/shared.service.interface';

@Injectable()
export class SharedService implements SharedServiceInterface {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Al igual que con el metodo static en el modulo shared, podemos
   * hacer lo mismo con la conexion del microservicio a RabbitMQ.
   *
   * Este metodo devuelve el objeto con la configuracion que necesita
   * la funcion .connectMicroservice en el respectivo main.ts de cada
   * microservicio, por lo que de esta forma el codigo queda mas
   * legible y reutilizable.
   *
   * Si no definieramos esto en un metodo, tendriamos que poner el
   * codigo del mismo por cada conexion de un microservicio a
   * RabbitMQ.
   */
  public getRmqOptions(queue: string): RmqOptions {
    /**
     * Esta es una forma en la que podemos acceder a las variables de
     * entorno desde el modulo de configuracion de NestJS, para esto
     * debimos haber proporcionado la ruta el archivo .env en el
     * .module de nuestro microservicio.
     *
     * Si es asi, solo basta con inyectar el modulo en el constructor
     * y podremos acceder a las variables de entorno desde el modulo
     * de configuracion de NestJS
     */
    const USER = this.configService.get('RABBITMQ_USER');
    const PASSWORD = this.configService.get('RABBITMQ_PASS');
    const HOST = this.configService.get('RABBITMQ_HOST');

    /**
     * Debemos definir las variables de configuracion para el
     * microservicio. Este objeto de configuracion es recibido por
     * la funcion .connectMicroservice<MicroserviceOptions>()
     *
     * Esta funcion recibe un objeto de tipo MicroserviceOptions, el
     * cual contiene:
     * - La capa de transporte
     * - La url de conexion con la capa de transporte
     *    (RabbitMQ en este caso).
     *
     * El noAck es cuando el consumidor recibe el mensaje y este notifica
     * de recibido (acuse de recibo), de esta forma lo dejamos de forma
     * automatica para no tener que hacerlo manual cuando esta en false.
     *
     * La queue es el nombre que definimos en las variables de entorno.
     * Esta queue es la que almacena las peticiones recibidas de la
     * api-gateway y las cuales van dirigidas a este microservicio.
     *
     * Con la queue podemos pasar las queueOptions, las cuales pueden
     * definir el comportamiento de la queue de rabbitmq para este
     * microservicio:
     * - durable establece si las request en la queue deben de
     *    persistir en caso de un reinicio del servicio
     */
    return {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  /**
   * Esta es la forma de refactorizar estas instrucciones, las cuales
   * son usadas en cada metodo de los @MessagePatterns En si, estas
   * lineas solo notifican a RabbitMQ que el mensaje ha sido recibido
   * y esto es necesario en cada funcion que maneja los mensajes.
   */
  public acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
