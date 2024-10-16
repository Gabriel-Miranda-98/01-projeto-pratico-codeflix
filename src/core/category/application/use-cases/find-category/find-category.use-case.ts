import { PaginationOutput, PaginationOutputMapper } from "../../../../shared/application/pagination-output";
import { IUseCase } from "../../../../shared/application/use-case.interface";
import { SortDirection } from "../../../../shared/domain/repositories/search-params";
import { CategoryFilter, ICategoryRepository, CategorySearchParams, CategorySearchResult } from "../../../domain/repositories/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";


type FindCategoryInput={
  page?: number;
  perPage?: number;
  sort?: string | null;
  sortDir?: SortDirection | null;
  filter?: CategoryFilter | null;

}
type FindCategoryOutput=PaginationOutput<CategoryOutput>


export class FindCategoryUseCase implements IUseCase<FindCategoryInput,FindCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: FindCategoryInput): Promise<FindCategoryOutput> {
    const params = new CategorySearchParams({
      filter: input.filter,
      page: input.page,
      per_page: input.perPage,
      sort: input.sort,
      sort_dir: input.sortDir,
     })
     const searchResult = await this.categoryRepository.search(params);
     
     return this.toOutput(searchResult)
  }


  private toOutput(searchResult:CategorySearchResult):FindCategoryOutput {
    const {items:_items}=searchResult;
    const items = _items.map(CategoryOutputMapper.toOutput);
    return PaginationOutputMapper.toOutput(items, searchResult);

  }
}