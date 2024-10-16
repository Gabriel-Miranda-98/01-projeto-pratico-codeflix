import { Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category.model"
import { CategorySequelizeRepository } from "../category.repository"
import { Category } from "../../../../domain/category.entity"
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import { CategorySearchParams } from "../../../../domain/repositories/category.repository"
import { setupSequelize } from "../../../../../shared/infra/testing/helpers"

describe("CategorySequelizeRepository Integration Tests", () => {
  let categorySequelizeRepository: CategorySequelizeRepository
  setupSequelize({
    models: [CategoryModel],
  })
  beforeEach(async()=>{
    categorySequelizeRepository = new CategorySequelizeRepository(CategoryModel)
  })

  it("should create a category", async () => {
    const category = Category.fake().aCategory().build()
    await categorySequelizeRepository.insert(category)

    const categoryCreated = await CategoryModel.findByPk(category.categoryId.id)

    expect(categoryCreated).not.toBeNull()
    expect(categoryCreated.toJSON()).toEqual(category.toJSON())
  })

  it("should update a category", async () => {
    const category = Category.fake().aCategory().build()
    await categorySequelizeRepository.insert(category)

    category.changeName("new name")
    await categorySequelizeRepository.update(category)

    const categoryUpdated = await CategoryModel.findByPk(category.categoryId.id)

    expect(categoryUpdated).not.toBeNull()
    expect(categoryUpdated.toJSON()).toEqual(category.toJSON())
  })


  it("should delete a category", async () => {
    const category = Category.fake().aCategory().build()
    await categorySequelizeRepository.insert(category)

    await categorySequelizeRepository.delete(category.categoryId)

    const categoryDeleted = await CategoryModel.findByPk(category.categoryId.id)

    expect(categoryDeleted).toBeNull()
  })

  it("should find a category by id", async () => {
    const category = Category.fake().aCategory().build()
    await categorySequelizeRepository.insert(category)

    const categoryFound = await categorySequelizeRepository.findById(category.categoryId)

    expect(categoryFound).not.toBeNull()
    expect(categoryFound?.toJSON()).toEqual(category.toJSON())
  })

  it("should find a category returning null when not found", async () => {
    const categoryFound = await categorySequelizeRepository.findById(Category.fake().aCategory().build().categoryId)

    expect(categoryFound).toBeNull()
  })

  it("should find all categories", async () => {
    const categories = Category.fake().theCategories(2).build()
    await categorySequelizeRepository.bulkInsert(categories)

    const categoriesFound = await categorySequelizeRepository.findAll()

    expect(categoriesFound.length).toBe(2)
    expect(categoriesFound.map(c=>c.toJSON())).toEqual(categories.map(c=>c.toJSON()))
  })

  it("should not find a category by id", async () => {
    const categoryId = Category.fake().aCategory().build().categoryId
    const categoryFound = await categorySequelizeRepository.findById(categoryId)

    expect(categoryFound).toBeNull()
  })

  it("should search categories with no params", async () => {
    const categories = Category.fake().theCategories(16).build()
    // get by categories order by createdAt desc and slice the last one
    const categoriesToSearch = categories.sort(
      (a,b)=>b.createdAt.getTime()-a.createdAt.getTime()
    ).slice(0,15)

    await categorySequelizeRepository.bulkInsert(categories)

    const categoriesFound = await categorySequelizeRepository.search(new CategorySearchParams)
    expect(categoriesFound.items.length).toBe(15)
    expect(categoriesFound.items.map(c=>c.toJSON())).toEqual(categoriesToSearch.map(c=>c.toJSON()))
  })

  it("should search categories with pagination", async () => {
    const categories = Category.fake().theCategories(16).build()
    // get by categories order by createdAt desc and slice the last one
    const categoriesToSearch = categories.sort(
      (a,b)=>b.createdAt.getTime()-a.createdAt.getTime()
    ).slice(0,5)

    await categorySequelizeRepository.bulkInsert(categories)

    const categoriesFound = await categorySequelizeRepository.search(new CategorySearchParams({page:1,per_page:5}))
    expect(categoriesFound.items.length).toBe(5)
    expect(categoriesFound.items.map(c=>c.toJSON())).toEqual(categoriesToSearch.map(c=>c.toJSON()))
  })

  it("should search categories with filter", async () => {
    const categories = Category.fake().theCategories(16).withName((index)=> `teste ${index}`).build()
    

    await categorySequelizeRepository.bulkInsert(categories)

    const categoriesFound = await categorySequelizeRepository.search(new CategorySearchParams({filter:categories[0].name}))
    
    expect(categoriesFound.items.length).toBe(1)
    expect(categoriesFound.items.map(c=>c.toJSON())).toEqual([categories[0].toJSON()])
    expect(categoriesFound.total).toBe(1)
    expect(categoriesFound.per_page).toBe(15)
    expect(categoriesFound.current_page).toBe(1)
    expect(categoriesFound.last_page).toBe(1)
    expect(categoriesFound.items[0].name).toBe('teste 0')

  })

  it("should search categories with sort", async () => {
    const categories = Category.fake().theCategories(16).build()
    // get by categories order by createdAt desc and slice the last one
    const categoriesToSearch = categories.sort(
      (a,b)=>a.name.localeCompare(b.name)
    )

    await categorySequelizeRepository.bulkInsert(categories)

    const categoriesFound = await categorySequelizeRepository.search(new CategorySearchParams({sort:"name",sort_dir:"asc",per_page:16}))
    expect(categoriesFound.items.length).toBe(16)
    expect(categoriesFound.items.map(c=>c.toJSON())).toEqual(categoriesToSearch.map(c=>c.toJSON()))
  })

  it("should return not found when try to update a category that does not exist", async () => {
    const category = Category.fake().aCategory().build()
    await expect(categorySequelizeRepository.update(category)).rejects.toThrow(new NotFoundError(category.categoryId.id,Category))
  })

  it("should return not found when try to delete a category that does not exist", async () => {
    const category = Category.fake().aCategory().build()
    await expect(categorySequelizeRepository.delete(category.categoryId)).rejects.toThrow(new NotFoundError(category.categoryId.id,Category))
  })
})