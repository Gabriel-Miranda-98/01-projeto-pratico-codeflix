import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo"
import { setupSequelize } from "../../../../../shared/infra/testing/helpers"
import { CategoryModel } from "../../../../infra/db/sequelize/category.model"
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category.repository"
import { CreateCategoryUseCase } from "../create-category.use-case"

describe('Create Category Use Case Integration Test', () => {
  let useCase:CreateCategoryUseCase
  let categoryRepository:CategorySequelizeRepository
  setupSequelize({models:[CategoryModel]})
  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel)
    useCase = new CreateCategoryUseCase(categoryRepository)
  })


  it.each([
    ['Category Test', 'Category Description Test', true],
    ['Category Test', null, true],
    ['Category Test', 'Category Description Test', false],
  ])('should create a category', async (name, description, isActive) => {
    const input = {
      name,
      description,
      isActive
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.description).toBe(input.description)
    expect(output.isActive).toBe(input.isActive)
    expect(output.createdAt).toBeDefined()
  })
  it('should create a category', async () => {
    const input = {
      name: 'Category Test',
      description: 'Category Description Test',
      isActive: true
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.description).toBe(input.description)
    expect(output.isActive).toBe(input.isActive)
    expect(output.createdAt).toBeDefined()

    const category = await categoryRepository.findById(Uuid.create(output.id))

    expect(category).toBeDefined()


  })

})