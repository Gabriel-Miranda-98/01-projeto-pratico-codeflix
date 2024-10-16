import { Entity } from '../../../domain/entity';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import { ValueObject } from '../../../domain/value-object';
import { Uuid } from '../../../domain/value-objects/uuid.vo';
import { InMemoryRepository } from './in-memory.repository';
type StubEntityProps = {
  entityId?: Uuid;
  name: string;
  price: number;
};
class StubEntity extends Entity {
  entityId: Uuid;
  name: string;
  price: number;
  constructor(props: StubEntityProps) {
    super();
    this.entityId = props.entityId || Uuid.create();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entityId: this.entityId.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });
  it('should insert a new entity', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 1,
      entityId: Uuid.create(),
    });
    await repository.insert(entity);
    expect(repository.items).toContain(entity);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0].entityId).toEqual(entity.entityId);
    expect(repository.items[0].name).toEqual(entity.name);
    expect(repository.items[0].price).toEqual(entity.price);
  });

  it('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        name: 'test',
        price: 1,
        entityId: Uuid.create(),
      }),
      new StubEntity({
        name: 'test2',
        price: 2,
        entityId: Uuid.create(),
      }),
    ];
    await repository.bulkInsert(entities);
    expect(repository.items).toEqual(entities);
    expect(repository.items.length).toBe(2);
    expect(repository.items[0].entityId).toEqual(entities[0].entityId);
    expect(repository.items[0].name).toEqual(entities[0].name);
    expect(repository.items[0].price).toEqual(entities[0].price);
    expect(repository.items[1].entityId).toEqual(entities[1].entityId);
    expect(repository.items[1].name).toEqual(entities[1].name);
    expect(repository.items[1].price).toEqual(entities[1].price);
  });

  it('should update an entity', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 1,
      entityId: Uuid.create(),
    });
    await repository.insert(entity);
    entity.name = 'test2';
    await repository.update(entity);
    expect(repository.items).toContain(entity);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0].entityId).toEqual(entity.entityId);
    expect(repository.items[0].name).toEqual(entity.name);
    expect(repository.items[0].price).toEqual(entity.price);
  });

  it('should delete an entity', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 1,
      entityId: Uuid.create(),
    });
    await repository.insert(entity);
    await repository.delete(entity.entityId);
    expect(repository.items).not.toContain(entity);
    expect(repository.items.length).toBe(0);
  });

  it('should find an entity by id', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 1,
      entityId: Uuid.create(),
    });
    await repository.insert(entity);
    const foundEntity = await repository.findById(entity.entityId);
    expect(foundEntity).toEqual(entity);
  });

  it('should return null if entity is not found', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 1,
      entityId: Uuid.create(),
    });
    const foundEntity = await repository.findById(entity.entityId);
    expect(foundEntity).toBeNull();
  });

  it('should find all entities', async () => {
    const entities = [
      new StubEntity({
        name: 'test',
        price: 1,
        entityId: Uuid.create(),
      }),
      new StubEntity({
        name: 'test2',
        price: 2,
        entityId: Uuid.create(),
      }),
    ];
    await repository.bulkInsert(entities);
    const foundEntities = await repository.findAll();
    expect(foundEntities).toEqual(entities);
    expect(foundEntities.length).toBe(2);
    expect(foundEntities[0].entityId).toEqual(entities[0].entityId);
    expect(foundEntities[0].name).toEqual(entities[0].name);
    expect(foundEntities[0].price).toEqual(entities[0].price);
    expect(foundEntities[1].entityId).toEqual(entities[1].entityId);
    expect(foundEntities[1].name).toEqual(entities[1].name);
    expect(foundEntities[1].price).toEqual(entities[1].price);
  });

  it('should throws error on update when entity is not found', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 1,
      entityId: Uuid.create(),
    });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity),
    );
  });

  it('should throws error on delete when entity is not found', async () => {
    const entity = new StubEntity({
      name: 'test',
      price: 1,
      entityId: Uuid.create(),
    });
    await expect(repository.delete(entity.entityId)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity),
    );
  });
});
