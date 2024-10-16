import { DataType, Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category.model"
import { Category } from "../../../../domain/category.entity"
import { setupSequelize } from "../../../../../shared/infra/testing/helpers"

describe("CategoryModel Integration Tests", () => {
  setupSequelize({
    models: [CategoryModel],
  })
  it("should create a category", async () => {
    const category = Category.fake().aCategory().build()
    await CategoryModel.create({
      categoryId: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt
    })

    const categoryCreated = await CategoryModel.findOne({
      where: {categoryId: category.categoryId.id}
    })


    expect(categoryCreated).not.toBeNull()

  })

  it("mapping props", async () => {
    const attributes = CategoryModel.getAttributes()
    const attributesKeys = Object.keys(attributes)
    expect(attributesKeys).toEqual([
      "categoryId",
      "name",
      "description",
      "isActive",
      "createdAt",
    ])

    const categoryIdAttr= attributes["categoryId"]
    expect(categoryIdAttr).toMatchObject({
      field: "category_id",
      fieldName:"categoryId",
      primaryKey: true,
      type:DataType.UUIDV4()
    })
    const nameAttr= attributes["name"]
    expect(nameAttr).toMatchObject({
      field: "name",
      fieldName:"name",
      allowNull:false,
      type:DataType.STRING(255)
    })
    const descriptionAttr= attributes["description"]
    expect(descriptionAttr).toMatchObject({
      field: "description",
      fieldName:"description",
      type:DataType.STRING(255)
    })
    const isActiveAttr= attributes["isActive"]
    expect(isActiveAttr).toMatchObject({
      field: "is_active",
      fieldName:"isActive",
      allowNull:false,
      type:DataType.BOOLEAN(),
      defaultValue: true
    })
    const createdAtAttr= attributes["createdAt"]
    expect(createdAtAttr).toMatchObject({
      field: "created_at",
      fieldName:"createdAt",
      allowNull:false,
      type:DataType.DATE(3)
    })

  })

  it("Create model", async () => {
    const arrange={
      //uuid generated v4
      categoryId:  "f7b3f1b1-3b7d-4b3b-8b3b-3b7b3b7b3b7b",
      name: "any_name",
      description: "any_description",
      isActive: true,
      createdAt: new Date()

    }

    const category = await CategoryModel.create(arrange)

    expect( category.toJSON()).toStrictEqual(arrange)
  
  });
})