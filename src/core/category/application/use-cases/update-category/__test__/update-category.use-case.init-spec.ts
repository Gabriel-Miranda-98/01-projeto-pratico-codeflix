import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Category } from '../../../../domain/category.entity';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category.repository';
import { UpdateCategoryUseCase } from '../update-category.use-case';

type Arrange = {
  input: {
    id: string;
    name: string;
    description?: null | string;
    isActive?: boolean;
  };
  expected: {
    id: string;
    name: string;
    description: null | string;
    isActive: boolean;
    createdAt: Date;
  };
};

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository;
  setupSequelize({ models: [CategoryModel] });
  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  });
  it('should throws error when entity not found', async () => {
    const uuid = Uuid.create();
    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });
  it('should update a category', async () => {
    const entity = Category.fake().aCategory().build();
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.categoryId.id,
          name: 'test',
          description: 'some description',
        },
        expected: {
          id: entity.categoryId.id,
          name: 'test',
          description: 'some description',
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.id,
          name: 'test',
        },
        expected: {
          id: entity.categoryId.id,
          name: 'test',
          description: 'some description',
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.id,
          name: 'test',
          isActive: false,
        },
        expected: {
          id: entity.categoryId.id,
          name: 'test',
          description: 'some description',
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.id,
          name: 'test',
        },
        expected: {
          id: entity.categoryId.id,
          name: 'test',
          description: 'some description',
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.id,
          name: 'test',
          isActive: true,
        },
        expected: {
          id: entity.categoryId.id,
          name: 'test',
          description: 'some description',
          isActive: true,
          createdAt: entity.createdAt,
        },
      },
      {
        input: {
          id: entity.categoryId.id,
          name: 'test',
          description: null,
          isActive: false,
        },
        expected: {
          id: entity.categoryId.id,
          name: 'test',
          description: null,
          isActive: false,
          createdAt: entity.createdAt,
        },
      },
    ];
    repository.insert(entity);
    let output = await useCase.execute({
      id: entity.categoryId.id,
      name: 'test',
    });

    expect(output).toStrictEqual({
      id: entity.categoryId.id,
      name: 'test',
      description: entity.description,
      isActive: true,
      createdAt: entity.createdAt,
    });

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...(i.input.name && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description }),
        ...('isActive' in i.input && { isActive: i.input.isActive }),
      });
      const entityUpdated = await repository.findById(Uuid.create(i.input.id));

      expect(output).toStrictEqual({
        id: entity.categoryId.id,
        name: i.expected.name,
        description: i.expected.description,
        isActive: i.expected.isActive,
        createdAt: entityUpdated.createdAt,
      });
      expect(entityUpdated.toJSON()).toStrictEqual({
        categoryId: entity.categoryId.id,
        name: i.expected.name,
        description: i.expected.description,
        isActive: i.expected.isActive,
        createdAt: entityUpdated.createdAt,
      });
    }
  });
});
