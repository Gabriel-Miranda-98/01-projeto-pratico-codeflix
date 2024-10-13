import { SortDirection } from "../../../../shared/domain/repositories/search-params";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { Category } from "../../../domain/category.entity";
import { CategoryFilter, ICategoryRepository } from "../../../domain/repositories/category.repository";


export class CategoryInMemoryRepository extends InMemorySearchableRepository<
  Category,
  Uuid
> implements ICategoryRepository {
  sortableFields: string[] = ["name", "createdAt"];
  protected async applyFilter(
    items: Category[],
    filter: CategoryFilter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }
    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
    });
  }
  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null
  ) {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, "createdAt", "desc");
  }
}