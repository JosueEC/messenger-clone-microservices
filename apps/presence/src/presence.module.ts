import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),

    SharedModule,
    /**
     * En el caso de que vayamos a usar los servicios de otro
     * microservicio en nuestro microservicio, es necesario dar
     * conocimiento del mismo en el archivo .module del microservicio.
     *
     * Esto lo logramos a traves de la funcion registerRmq definida
     * el el SharedModule.
     *
     * Esto seria el equivalente a importat Modulos para hacer uso
     * de sus archivos pero ahora con Microservicios.
     */
    // SharedModule.registerRmq({
    //   service: 'AUTH_SERVICE',
    //   queue: process.env.RABBITMQ_AUTH_QUEUE,
    // }),
  ],
  controllers: [PresenceController],
  /**
   * En este caso, la razon de importar el microservicio es que vamos
   * a usar el AuthGuard en algunas de las rutas del microservicio
   * 'presence', y a su ves, este guard hace uso de funciones del
   * microservicio auth, por ende, el microservicio 'presence' debe
   * tener conocimiento del microservicio 'auth'
   */
  // providers: [PresenceService, AuthGuard],
  providers: [PresenceService],
})
export class PresenceModule {}
