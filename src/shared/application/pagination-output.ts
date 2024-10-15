import { SearchResult } from "../domain/repositories/search-result";

export type PaginationOutput<Item=unknown> = {
  items: Item[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}


export class PaginationOutputMapper{
  static toOutput<Item=unknown>(items: Item[], props:Omit<SearchResult, 'items'>): PaginationOutput<Item>{
    return {
      items,
      total: props.total,
      current_page: props.current_page,
      per_page: props.per_page,
      last_page: props.last_page
    }
  }
}