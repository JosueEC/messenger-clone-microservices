import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('POSTGRES_URI'),
        /**
         * autoLoadEntities busca de manera automatica las clases
         * marcadas con la anotacion @Entity, de esta forma no es
         * necesario añadirlas de forma manual con la funcion
         * .forFeature() de TypeOrmModule
         */
        autoLoadEntities: true,
        /**
         * Synchronize sincroniza los cambios en las entidades
         * definidas con codigo y las creadas en la base de datos,
         * esto significa que cuando ocurra un cambio en la entidad,
         * esta se eliminar para crear la nueva.
         *
         * Dado lo anterior, esta opcion solo debe usarse en el
         * ambiente de desarrollo, en produccion se usan migraciones
         * para modificar entidades, ya que con estas no tenemos
         * perdidas de informacion.
         */
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
