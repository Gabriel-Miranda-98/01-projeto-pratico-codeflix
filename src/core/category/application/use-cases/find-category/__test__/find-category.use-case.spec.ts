import { Category } from '../../../../domain/category.entity';
import { CategorySearchResult } from '../../../../domain/repositories/category.repository';
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { CategoryOutputMapper } from '../../common/category-output';
import { FindCategoryUseCase } from '../find-category.use-case';
describe('ListCategoriesUseCase Unit Tests', () => {
  let useCase: FindCategoryUseCase;
  let repository: CategoryInMemoryRepository;
  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new FindCategoryUseCase(repository);
  });
  test('toOutput method', () => {
    let result = new CategorySearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    let output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
    const entity = Category.create({ name: 'Movie' });
    result = new CategorySearchResult({
      items: [entity],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    output = useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity].map(CategoryOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });
  it('should return output sorted by createdAt when input param is empty', async () => {
    const items = [
      new Category({ name: 'test 1' }),
      new Category({
        name: 'test 2',
        createdAt: new Date(new Date().getTime() + 100),
      }),
    ];
    repository.items = items;
    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(CategoryOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });
  it('should return output using pagination, sort and filter', async () => {
    const items = [
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
    repository.items = items;
    let output = await useCase.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[1], items[2]].map(CategoryOutputMapper.toOutput),
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
    expect(output).toStrictEqual({
      items: [items[0]].map(CategoryOutputMapper.toOutput),
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
    expect(output).toStrictEqual({
      items: [items[0], items[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
