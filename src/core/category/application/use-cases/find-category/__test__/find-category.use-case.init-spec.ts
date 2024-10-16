import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Category } from '../../../../domain/category.entity';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category.repository';
import { CategoryOutputMapper } from '../../common/category-output';
import { FindCategoryUseCase } from '../find-category.use-case';
describe('FindCategoryUseCase Integration Tests', () => {
  let useCase: FindCategoryUseCase;
  let repository: CategorySequelizeRepository;
  setupSequelize({ models: [CategoryModel] });
  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new FindCategoryUseCase(repository);
  });
  it('should return output sorted by created_at when input param is empty', async () => {
    const categories = Category.fake()
      .theCategories(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();
    await repository.bulkInsert(categories);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...categories].reverse().map(CategoryOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });
  it('should returns output using pagination, sort and filter', async () => {
    const categories = [
      Category.create({ name: 'a' }),
      Category.create({
        name: 'AAA',
      }),
      Category.create({
        name: 'AaA',
      }),
      Category.create({
        name: 'b',
      }),
      Category.create({
        name: 'c',
      }),
    ];
    await repository.bulkInsert(categories);
    let output = await useCase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toEqual({
      items: [categories[1], categories[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
    output = await useCase.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toEqual({
      items: [categories[0]].map(CategoryOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
    output = await useCase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'desc',
      filter: 'a',
    });
    expect(output).toEqual({
      items: [categories[0], categories[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
