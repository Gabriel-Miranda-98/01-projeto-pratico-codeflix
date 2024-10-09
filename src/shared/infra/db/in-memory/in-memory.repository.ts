import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { IRepository } from "../../../domain/repositories/repository.interface";
import { ValueObject } from "../../../domain/value-object";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject> implements IRepository<E,EntityId>{
  items: E[] = []
  async insert(entity: any): Promise<void> {
    this.items.push(entity)
  }
 async bulkInsert(entities: any[]): Promise<void> {
    this.items.push(...entities)
  }
  async update(entity: E): Promise<void> {
    const index = this.items.findIndex((item) => item.entityId.equals(entity.entityId))
    if (index === -1) throw new NotFoundError(entity.entityId, this.getEntity())
    this.items[index] = entity
  }
  async delete(entity: E): Promise<void> {
    const index = this.items.findIndex((item) => item.entityId.equals(entity.entityId))
    if (index === -1) throw new NotFoundError(entity.entityId, this.getEntity())
    this.items.splice(index, 1)
    }

  async findById(id: EntityId): Promise<E|null> {
    const item = this.items.find((item) => item.entityId.equals(id))
    return item||null
  }

  
  async findAll(): Promise<E[]> {
    return this.items
  }
  abstract getEntity(): new (...args: any[]) => E 

}