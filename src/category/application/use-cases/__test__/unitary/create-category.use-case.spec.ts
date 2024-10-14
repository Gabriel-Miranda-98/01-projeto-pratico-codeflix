import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository"
import { CreateCategoryUseCase } from "../../create-category.use-case"

describe('Create Category Use Case Unit Test', () => {
  let useCase:CreateCategoryUseCase
  let categoryRepository:CategoryInMemoryRepository

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository()
    useCase = new CreateCategoryUseCase(categoryRepository)
  })

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(categoryRepository, 'insert')
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
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should create a category without description', async () => {
    const spyInsert = jest.spyOn(categoryRepository, 'insert')
    const input = {
      name: 'Category Test',
      isActive: true
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.description).toBeNull()
    expect(output.isActive).toBe(input.isActive)
    expect(output.createdAt).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should create a category without isActive', async () => {
    const spyInsert = jest.spyOn(categoryRepository, 'insert')
    const input = {
      name: 'Category Test',
      description: 'Category Description Test'
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.description).toBe(input.description)
    expect(output.isActive).toBe(true)
    expect(output.createdAt).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should create a category without description and isActive', async () => {
    const spyInsert = jest.spyOn(categoryRepository, 'insert')
    const input = {
      name: 'Category Test'
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.description).toBeNull()
    expect(output.isActive).toBe(true)
    expect(output.createdAt).toBeDefined()
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })
})