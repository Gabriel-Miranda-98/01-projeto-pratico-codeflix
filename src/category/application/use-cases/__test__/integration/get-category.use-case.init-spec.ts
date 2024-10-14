import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category.repository";
import { GetCategoryUseCase } from "../../get-category.use-case";

describe('Get Category Use Case Integration Test', () => {
  let useCase: GetCategoryUseCase;
  let categoryRepository: CategorySequelizeRepository;
  setupSequelize({ models: [CategoryModel] });
  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(categoryRepository);
  });
 it('should throw an error when category not found', async () => {
    const id = Uuid.create().toString();
    await expect(() => useCase.execute({ id })).rejects.toThrow(new NotFoundError(id, Category));
  })
  it('should throw an error when invalid uuid', async () => {
    await expect(() => useCase.execute({ id: "123" })).rejects.toThrow(new InvalidUuidError());
  })
  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    await categoryRepository.insert(category);

    const output = await useCase.execute({ id: category.categoryId.id });

    expect(output).toBeDefined();
    expect(output).toStrictEqual({
      id: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt
    })
  });

  


});