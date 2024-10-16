import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../../domain/category.entity';
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { GetCategoryUseCase } from '../get-category.use-case';

describe('GetCategoryUseCase Unit Test', () => {
  let usecase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new GetCategoryUseCase(repository);
  });

  it('should throw an error when category not found', async () => {
    const id = Uuid.create().toString();
    await expect(() =>
      usecase.execute({
        id,
      }),
    ).rejects.toThrow(new NotFoundError(id, Category));
  });

  it('should throw an error when invalid uuid', async () => {
    await expect(() =>
      usecase.execute({
        id: '123',
      }),
    ).rejects.toThrow(new InvalidUuidError());
  });

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const result = await usecase.execute({
      id: category.categoryId.id,
    });
    expect(result).toEqual({
      id: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });
  });
});
