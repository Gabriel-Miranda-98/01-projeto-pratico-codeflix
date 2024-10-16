import { ISearchableRepository } from '../../../shared/domain/repositories/repository.interface';
import { SearchParams } from '../../../shared/domain/repositories/search-params';
import { SearchResult } from '../../../shared/domain/repositories/search-result';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../category.entity';

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}
export class CategorySearchResult extends SearchResult<Category> {}
export interface ICategoryRepository
  extends ISearchableRepository<
    Category,
    Uuid,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
