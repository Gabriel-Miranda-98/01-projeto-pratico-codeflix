import { IUseCase } from "../../../shared/application/use-case.interface"
import { NotFoundError } from "../../../shared/domain/errors/not-found.error"
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo"
import { Category } from "../../domain/category.entity"
import { ICategoryRepository } from "../../domain/repositories/category.repository"
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output"


type UpdateCategoryInput = {
  id: string
  name?: string
  description?: string|null
  isActive?: boolean
}


type UpdateCategoryOutput = CategoryOutput

export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}
  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const categoryId = Uuid.create(input.id)
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      throw new NotFoundError(categoryId, Category)
    }

    if (input.name) {
      category.changeName(input.name)
    }

    if ("description" in input) {
      category.changeDescription(input.description);
    }

    if (input.isActive===true) {
      category.activate()
    }

    if (input.isActive===false) {
      category.deactivate()
    }
    await this.categoryRepository.update(category)

    return CategoryOutputMapper.toOutput(category)

  }
}