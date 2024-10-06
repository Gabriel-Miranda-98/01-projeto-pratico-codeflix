import { Category } from "../category.entity"

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

  it("should restore category",()=>{
    const createdAt=new Date()
    const category = Category.restore({
      name:"Test Category",
      description:"Test Description",
      isActive:false,
      createdAt
    })
    expect(category.categoryId).toBeUndefined()
    expect(category.name).toBe("Test Category")
    expect(category.isActive).toBe(false)
    expect(category.createdAt).toBe(createdAt)
    expect(category.description).toBe("Test Description")
    
  })

  it("should change category name",()=>{
    const category = Category.create({
      name:"Test Category"
    })
    category.changeName("New Category")
    expect(category.name).toBe("New Category")
  })

  it("should change category description",()=>{
    const category = Category.create({
      name:"Test Category"
    })
    category.changeDescription("New Description")
    expect(category.description).toBe("New Description")
  })


  it("should activate category",()=>{
    const category = Category.create({
      name:"Test Category",
      isActive:false
    })
    category.activate()
    expect(category.isActive).toBe(true)
  })

  it("should deactivate category",()=>{
    const category = Category.create({
      name:"Test Category",
      isActive:true
    })
    category.deactivate()
    expect(category.isActive).toBe(false)
  })


  it("should create category from command",()=>{
    const category = Category.create({
      name:"Test Category",
      description:"Test Description",
      isActive:false
    })
    expect(category.categoryId).toBeUndefined()
    expect(category.name).toBe("Test Category")
    expect(category.isActive).toBe(false)
    expect(category.description).toBe("Test Description")
  })
})