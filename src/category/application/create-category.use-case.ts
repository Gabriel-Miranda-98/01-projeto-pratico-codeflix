import { IUseCase } from "../../shared/application/use-case.interface";
import { Category } from "../domain/category.entity";
import { ICategoryRepository } from "../domain/repositories/category.repository";

export type CreateCategoryInput = {
  name: string
  description?: string|null
  isActive?: boolean

}

export type CreateCategoryOutput = {
  id: string
  name: string
  description: string|null
  isActivated: boolean
  createdAt: Date
}


export class CreateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}
  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create(input)

    await this.categoryRepository.insert(category)

    return {
      id: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActivated: category.isActive,
      createdAt: category.createdAt
    }

  }
}



