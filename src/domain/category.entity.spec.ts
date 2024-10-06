import { Category } from "./category.entity"

describe("Category Unit Test",()=>{
  it("should create category",()=>{
    let category = new Category({
      name:"Test Category"
    })
    expect(category.name).toBe("Test Category")
    expect(category.isActive).toBe(true)
    expect(category.createdAt).toBeInstanceOf(Date)
    expect(category.description).toBeNull()
    expect(category.categoryId).toBeUndefined()
    const createdAt=new Date()
    category = new Category({
      name:"Test Category",
      description:"Test Description",
      isActive:false,
      createdAt
    })

    expect(category.name).toBe("Test Category")
    expect(category.isActive).toBe(false)
    expect(category.createdAt).toBe(createdAt)
    expect(category.description).toBe("Test Description")
    expect(category.categoryId).toBeUndefined()
  })
})