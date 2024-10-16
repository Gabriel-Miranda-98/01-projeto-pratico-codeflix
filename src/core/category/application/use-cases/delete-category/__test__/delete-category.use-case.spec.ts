import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../../domain/category.entity';
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('InMemoryRepository Unit Tests', () => {
  let usecase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new DeleteCategoryUseCase(repository);
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

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const spyDelete = jest.spyOn(repository, 'delete');
    await usecase.execute({
      id: category.categoryId.id,
    });
    const result = await repository.findById(category.categoryId);
    expect(result).toBeNull();
    expect(spyDelete).toHaveBeenCalledTimes;
  });
});
