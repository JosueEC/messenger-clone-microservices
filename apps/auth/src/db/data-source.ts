import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

ConfigModule.forRoot({
  envFilePath: '.env',
});

const configService = new ConfigService();
/**
 * El objeto DataSource nos permite definir configuraciones de
 * nuestra base de datos. Este objeto recibe como parametro un
 * objeto DataSourceOptions en el cual se detallan las
 * configuraciones mencionadas.
 *
 * Al usar el objeto dataSourceOptions, podemos esparcir sus
 * propiedades en la funcion useFactory en el auth.module, de
 * esta forma separamos estas configuraciones y vuelve mas
 * legible el codigo del auth.module
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  // entities: [__dirname + '/../apps/auth/**/**/*.entity{.ts,.js}'],
  entities: [UserEntity],
  /**
   * Esta es la ruta donde se almacenaran los archivos de las
   * migraciones.
   *
   * NOTA: Para poder usar las migraciones es necesario ir al
   * archivo nest-cli.json y cambiar la propiedad webpack de
   * true a false. Esta se encuentra dentro de compilerOptions.
   * Esto es para que la compilacion sea generada por el
   * compilador de typescript en lugar de usar webpack
   */
  migrations: ['dist/apps/auth/db/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: false,
};

export const dataSource = new DataSource(dataSourceOptions);
