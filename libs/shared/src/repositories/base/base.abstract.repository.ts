/**
 * * Abstract Repository
 * Nos permite separar la logica de negocio de la base de datos.
 * Esto significa:
 *
 * Toda la logica para conexion e interaccion con la base de datos
 * estara en esta clase, en caso de que nuestras consultas son
 * sub-optimas, es necesario usar SQL crudo, cambiar de base de
 * datos, etc. Todos esos cambios ocurriran solo en esta clase,
 * sin necesidad de modificar los servicios donde tenemos parte
 * de logica de negocio.
 *
 * De esta forma, la logica de negocio queda desacoplada de la
 * infraestructura de la base de datos.
 */
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseInterfaceRepository } from './base.interface.repository';

interface HasId {
  id: number;
}

/**
 * * BaseAbstractRepository<T extends HasId>
 * Es la clase abstracta que implementara los metodos de la interface
 * repository, aqui se define el codigo que se ejecutara para
 * cada funcion.
 */
export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  /**
   * Aqui, primero estamos injectando la entidad como un Repository
   * a traves del constructor de la clase.
   *
   * Es un Repository para poder acceder a los metodos save, remove,
   * create, etc. Los metodos tipicos de un Repository en TypeORM
   */
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  /**
   * Una vez injectada la entidad, podemos empezar a definir la
   * logica de los metodos de la BaseInterfaceRepository
   */
  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async findOneById(id: any): Promise<T> {
    /**
     * Observa que podemos crear los objetos de los consultas y
     * tiparlas con FindOptionsWhere<T>
     */
    const options: FindOptionsWhere<T> = {
      id: id,
    };

    return await this.entity.findOneBy(options);
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(filterCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }
}
