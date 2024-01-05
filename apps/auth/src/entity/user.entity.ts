import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    nullable: false,
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    name: 'email',
    unique: true,
  })
  email: string;

  /**
   * * select: false
   * Nos permite indicar que la columna marcada con esta propiedad
   * no sera devuelta al cliente en ningun tipo de consulta, de esta
   * forma evitamos que el password sea devuelto al cliente, lo cual
   * seria un problema de seguridad.
   */
  @Column({
    name: 'password',
    select: false,
  })
  password: string;
}
