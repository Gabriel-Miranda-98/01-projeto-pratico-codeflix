import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/repositories/category.repository";


type DeleteCategoryInput = {
  id: string
}

type DeleteCategoryOutput = void
export class DeleteCategoryUseCase implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput> {
  constructor(private readonly categoryRepository:ICategoryRepository) {}
  async execute(input:DeleteCategoryInput): Promise<DeleteCategoryOutput> {
   const categoryId = Uuid.create(input.id)
   await this.categoryRepository.delete(categoryId)
    

    
  }
}