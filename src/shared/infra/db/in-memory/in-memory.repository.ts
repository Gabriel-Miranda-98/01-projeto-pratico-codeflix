import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { IRepository, ISearchableRepository } from "../../../domain/repositories/repository.interface";
import { SearchParams, SortDirection } from "../../../domain/repositories/search-params";
import { SearchResult } from "../../../domain/repositories/search-result";
import { ValueObject } from "../../../domain/value-object";
import { Uuid } from "../../../domain/value-objects/uuid.vo";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject> implements IRepository<E,EntityId>{
  items: E[] = []
  async insert(entity: any): Promise<void> {
    this.items.push(entity)
  }
 async bulkInsert(entities: any[]): Promise<void> {
    this.items.push(...entities)
  }
  async update(entity: E): Promise<void> {
    const index = this.items.findIndex((item) => item.entityId.equals(entity.entityId))
    if (index === -1) throw new NotFoundError(entity.entityId, this.getEntity())
    this.items[index] = entity
  }
  async delete(entityId: Uuid): Promise<void> {
    const index = this.items.findIndex((item) => item.entityId.equals(entityId))
    if (index === -1) throw new NotFoundError(entityId, this.getEntity())
    this.items.splice(index, 1)
    }

  async findById(id: EntityId): Promise<E|null> {
    const item = this.items.find((item) => item.entityId.equals(id))
    return item||null
  }

  
  async findAll(): Promise<E[]> {
    return this.items
  }
  abstract getEntity(): new (...args: any[]) => E 

}


export abstract class InMemorySearchableRepository<E extends Entity, EntityId extends ValueObject,
Filter=string> 
extends InMemoryRepository<E,EntityId> 
implements ISearchableRepository<E,EntityId,Filter>
{
  sortableFields: string[]=[];
  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
   const itemsFiltered=await this.applyFilter(this.items,props.filter);
   const itemsSorted=await this.applySort(itemsFiltered,props.sort,props.sort_dir);
   const itemsPaginated=this.applyPagination(itemsSorted,props.page,props.per_page);

   return new SearchResult({
     items:itemsPaginated,
     total:itemsFiltered.length,
     current_page:props.page,
     per_page:props.per_page
   })
  }
  

  protected abstract applyFilter(items:E[],filters:Filter|null):Promise<E[]>

  protected async applySort(items:E[],sort:string|null,sortDir:SortDirection|null,customGetter?: (sort: string, item: E) => any):Promise<E[]>{
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }
    return [...items].sort((a, b) => {
      //@ts-ignore
      const aValue = customGetter ? customGetter(sort, a) : a[sort];
      //@ts-ignore
      const bValue = customGetter ? customGetter(sort, b) : b[sort];
      if (aValue < bValue) {
        return sortDir === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDir === "asc" ? 1 : -1;
      }
      return 0;
    });
  }


  protected applyPagination(items:E[],page:SearchParams['page'], perPage:SearchParams['per_page']):E[]{
    const start=(page-1)*perPage;
    const end=start+perPage;
    return items.slice(start,end);

  }
}