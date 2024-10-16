import { Not } from "sequelize-typescript"
import { Category } from "../../../../domain/category.entity"
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository"
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import { InvalidUuidError, Uuid } from "../../../../../shared/domain/value-objects/uuid.vo"
import { UpdateCategoryUseCase } from "../update-category.use-case"

describe('UpdateCategoryUseCase Unit Test', () => {
  let useCase:UpdateCategoryUseCase
  let categoryRepository:CategoryInMemoryRepository

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository()
    useCase = new UpdateCategoryUseCase(categoryRepository)
  })

  it('should throws error when entity not found', async () => {
    await expect(()=> useCase.execute({
      id:"123",
      name: 'Category Test',
    })).rejects.toThrow(new InvalidUuidError())

  })

  it('should throw an error when category not found', async () => {
    const uuid= Uuid.create()
    const input = {
      id: uuid.toString(),
      name: 'new Name Test',
      description: 'Category Description Test',
      isActive: false
    }

    await expect(useCase.execute(input)).rejects.toThrow(new NotFoundError(input.id, Category))
  })

  it('should throw an error when name is too long', async () => {
    const categoryInsert = Category.fake().aCategory().withName('Category Test').build()
    await categoryRepository.insert(categoryInsert)
    const input = {
      id: categoryInsert.categoryId.id,
      name: 'a'.repeat(256),
      description: 'Category Description Test',
      isActive: false
    }

    await expect(useCase.execute(input)).rejects.toThrow('Entity Validation Error')
  })

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update')
    const categoryInsert = Category.fake().aCategory().withName('Category Test').build()
    await categoryRepository.insert(categoryInsert)
    const input = {
      id: categoryInsert.categoryId.id,
      name: 'new Name Test',
      description: 'Category Description Test',
      isActive: false
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.description).toBe(input.description)
    expect(output.isActive).toBe(input.isActive)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })

  it('should update a category with only name', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update')
    const categoryInsert = Category.fake().aCategory().withName('Category Test').build()
    await categoryRepository.insert(categoryInsert)
    const input = {
      id: categoryInsert.categoryId.id,
      name: 'new Name Test',
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.description).toBe(categoryInsert.description)
    expect(output.isActive).toBe(categoryInsert.isActive)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })

  it('should update a category with only description', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update')
    const categoryInsert = Category.fake().aCategory().withName('Category Test').build()
    await categoryRepository.insert(categoryInsert)
    const input = {
      id: categoryInsert.categoryId.id,
      description: 'Category Description Test',
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(categoryInsert.name)
    expect(output.description).toBe(input.description)
    expect(output.isActive).toBe(categoryInsert.isActive)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })

  it('should update a category with only isActive', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update')
    const categoryInsert = Category.fake().aCategory().withName('Category Test').build()
    await categoryRepository.insert(categoryInsert)
    const input = {
      id: categoryInsert.categoryId.id,
      isActive: false,
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(categoryInsert.name)
    expect(output.description).toBe(categoryInsert.description)
    expect(output.isActive).toBe(input.isActive)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })


  it('should update a category with only isActive true', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update')
    const categoryInsert = Category.fake().aCategory().withName('Category Test').deactivate().build()
    await categoryRepository.insert(categoryInsert)
    const input = {
      id: categoryInsert.categoryId.id,
      isActive: true,
    }

    const output = await useCase.execute(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(categoryInsert.name)
    expect(output.description).toBe(categoryInsert.description)
    expect(output.isActive).toBe(input.isActive)
    expect(spyUpdate).toHaveBeenCalledTimes(1)
  })



})