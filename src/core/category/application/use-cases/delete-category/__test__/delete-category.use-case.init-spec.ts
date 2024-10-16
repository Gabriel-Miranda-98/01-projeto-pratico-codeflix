import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Category } from '../../../../domain/category.entity';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category.repository';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let categoryRepository: CategorySequelizeRepository;
  setupSequelize({ models: [CategoryModel] });
  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(categoryRepository);
  });

  it('should throw an error when category not found', async () => {
    const id = Uuid.create().toString();
    await expect(() => useCase.execute({ id })).rejects.toThrow(
      new NotFoundError(id, Category),
    );
  });

  it('should throw an error when invalid uuid', async () => {
    await expect(() =>
      useCase.execute({
        id: '123',
      }),
    ).rejects.toThrow(new InvalidUuidError());
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await categoryRepository.insert(category);
    const spyDelete = jest.spyOn(categoryRepository, 'delete');
    await useCase.execute({
      id: category.categoryId.id,
    });
    const result = await categoryRepository.findById(category.categoryId);
    expect(result).toBeNull();
  });
});
