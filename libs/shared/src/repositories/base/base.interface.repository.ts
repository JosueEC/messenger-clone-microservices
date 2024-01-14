/**
 * Estas interfaces vienen de typeorm, y nos son utiles para definir
 * tipados especiales para bases de datos. En este ejemplo, se
 * estan usando para los tipados en la interface para implementar
 * Abstract Repository
 */
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

/**
 * Esta es la interface usada para implementar el patron de diseño
 * 'Abstract Repository', aqui se van a definir los metodos que
 * seran implementados para la entidad que sea recibida en el dato
 * generico de la interface.
 *
 * Como puedes ver, son los mismos metodos que cuando injectamos un
 * Repository de NestJS.
 *
 * * BaseInterfaceRepository<T>
 * Indica que se puede usar esta interface pasando un dato generico
 * a la misma, y de esta forma, tipando las funciones de la interface
 * en base al dato generico recibido.
 *
 * * DeepPartial
 * Indica que las propiedades de la entidad recibida son opcionales,
 * ejemplo, si usamos un UserEntity, significa que en los parametros
 * podemos recibir su id, name, age, email, etc, pudiendo venir
 * todas las propiedades o algunas no.
 *
 * Los retornos de las funciones, son en base a lo que se va a
 * devolver, por ejemplo, en create solo se crean los objetos,
 * pero en save ya ocurre una conexion asincrona con la base de
 * datos, por lo que esta funcion devuelve una promesa.
 *
 * * FindOneOptions<T>
 * Representa todas las opciones por las cuales se puede buscar
 * una entidad en base a las propiedades del generico, es decir,
 * puedes buscar solo por id o por email o combinadas y demas
 * opciones que abarca esta interface
 *
 * * FindManyOptions<T>
 * Ocurre lo mismo que con FindOneOptions<T> pero esta devuelve
 * varios resultados en lugar de uno solo.
 *
 * * findWithRelations
 * Es un metodo que nos permitira traer varios registros y sus
 * relaciones con otras entidades
 */
export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: number): Promise<T>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
}
