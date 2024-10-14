import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/repositories/category.repository";

type GetCategoryInput = {
  id: string
}

type GetCategoryOutput = {
  id: string
  name: string
  description: string|null
  isActive: boolean
  createdAt: Date
}

export class GetCategoryUseCase implements IUseCase<GetCategoryInput,GetCategoryOutput>{
  constructor(private readonly categoryRepository: ICategoryRepository) {}
  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const categoryId = Uuid.create(input.id)
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      throw new NotFoundError(categoryId, Category)
    }

    return {
      id: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt
    }
  }
}