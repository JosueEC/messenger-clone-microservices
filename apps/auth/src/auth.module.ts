import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { dataSourceOptions } from './db/data-source';
import { PostgresDBModule } from '@app/shared';
import { SharedModule } from '@app/shared';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    SharedModule,
    PostgresDBModule,
    /**
     * Al crear el modulo PostgresDBModule lo que hacemos es separar
     * la logica de conexion con la base de datos de postgres, ya que
     * esta sera la misma para varios de los microservicios y todos
     * comparten las mismas dataSourceOptions.
     *
     * Por lo tanto, ahora solo basta con importar el PostgresDBModule
     * para obtener la conexion del microservicio con la base de datos
     * de postgres.
     *
     * A diferencia de que en un monolito basta con tener este codigo
     * de conexion en el .module principal, ya que solo habra una
     * conexion con la base de datos
     */
    // TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
