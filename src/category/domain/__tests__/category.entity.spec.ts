import { Uuid } from "../../../shared/domain/value-objects/uuid.vo"
import { Category } from "../category.entity"

describe("Category Unit Test",()=>{
  let validateSpy:jest.SpyInstance
  beforeEach(()=>{
    validateSpy = jest.spyOn(Category,"validate")
  })
  it("should create category",()=>{
    let category = Category.create({
      name:"Test Category"
    })
    expect(category.name).toBe("Test Category")
    expect(category.isActive).toBe(true)
    expect(category.createdAt).toBeInstanceOf(Date)
    expect(category.description).toBeNull()
    expect(category.categoryId).toBeInstanceOf(Uuid)
    expect(validateSpy).toHaveBeenCalledTimes(1)
    const createdAt=new Date()
    category =  Category.restore({
      name:"Test Category",
      description:"Test Description",
      isActive:false,
      createdAt
    })

    expect(category.name).toBe("Test Category")
    expect(category.isActive).toBe(false)
    expect(category.createdAt).toBe(createdAt)
    expect(category.description).toBe("Test Description")
    expect(category.categoryId).toBeInstanceOf(Uuid)
    expect(validateSpy).toHaveBeenCalledTimes(2)

  })

  it("should restore category",()=>{
    const createdAt=new Date()
    const category = Category.restore({
      name:"Test Category",
      description:"Test Description",
      isActive:false,
      createdAt
    })
    expect(category.categoryId).toBeInstanceOf(Uuid)
    expect(category.name).toBe("Test Category")
    expect(category.isActive).toBe(false)
    expect(category.createdAt).toBe(createdAt)
    expect(category.description).toBe("Test Description")
    expect(validateSpy).toHaveBeenCalledTimes(1)

    
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
    expect(validateSpy).toHaveBeenCalledTimes(2)

  })


  it("should activate category",()=>{
    const category = Category.create({
      name:"Test Category",
      isActive:false
    })
    category.activate()
    expect(category.isActive).toBe(true)
    expect(validateSpy).toHaveBeenCalledTimes(1)

  })

  it("should deactivate category",()=>{
    const category = Category.create({
      name:"Test Category",
      isActive:true
    })
    expect(validateSpy).toHaveBeenCalledTimes(1)

    category.deactivate()
    expect(category.isActive).toBe(false)
  })


  it("should create category from command",()=>{
    const category = Category.create({
      name:"Test Category",
      description:"Test Description",
      isActive:false
    })
    expect(category.categoryId).toBeInstanceOf(Uuid)
    expect(category.name).toBe("Test Category")
    expect(category.isActive).toBe(false)
    expect(category.description).toBe("Test Description")
  })
 
})


describe("categoryId Field",()=>{
  const arrange=[{categoryId:null},{categoryId:undefined},{categoryId:Uuid.create()}]
  test.each(arrange)("should create category with categoryId %j",({categoryId})=>{
    const category = Category.restore({
      name:"Test Category",
      categoryId: categoryId as any 
    })
    expect(category.categoryId).toBeInstanceOf(Uuid)

    if(categoryId){
      expect(category.categoryId).toBe(categoryId)
    }
  })
})


describe("Category Validator",()=>{
  describe("Create a new category",()=>{
    it("should an invalid category with name property",()=>{
      expect(()=> Category.create({name:null})).containsErrorMessages({
        name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })

      expect(()=> Category.create({name:""})).containsErrorMessages({
        name: [
          'name should not be empty',
        ]
      })

      expect(()=> Category.create({name:"a".repeat(256)})).containsErrorMessages({
        name: [
          'name must be shorter than or equal to 255 characters'
        ]
      })

      expect(()=> Category.create({name:5 as any})).containsErrorMessages({
        name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      })
      
    })

    it("should a invalid category using description property", () => {
      expect(() =>
        Category.create({ description: 5 } as any)
      ).containsErrorMessages({
        description: ["description must be a string"],
      });
    });
    it("should a invalid category using is_active property", () => {
      expect(() =>
        Category.create({ isActive: 5 } as any)
      ).containsErrorMessages({
        isActive: ["isActive must be a boolean value"],
      });
    });
    

  })



describe("changeName method", () => {
  it("should a invalid category using name property", () => {
    const category = Category.create({ name: "Movie" });
    expect(() => category.changeName(null)).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    })
    expect(() => category.changeName("")).containsErrorMessages({
      name: ["name should not be empty"],
    })
    expect(() => category.changeName(5 as any)).containsErrorMessages({
      name: [
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    })
    expect(() => category.changeName("t".repeat(256))).containsErrorMessages({
      name: ["name must be shorter than or equal to 255 characters"],
    })
  })
})

describe("changeDescription method", () => {
  it("should a invalid category using description property", () => {
    const category = Category.create({ name: "Movie" });
    expect(() => category.changeDescription(5 as any)).containsErrorMessages({
      description: ["description must be a string"],
    })
  })
})

})