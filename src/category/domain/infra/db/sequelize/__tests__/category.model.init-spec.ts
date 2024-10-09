import { Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category.model"
import { Category } from "../../../../category.entity"

describe("CategoryModel Integration Tests", () => {
  it("should create a category", async () => {
    const sequelize =new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      
    })

    await sequelize.sync({force: true})

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

    console.log(categoryCreated)

    expect(categoryCreated).not.toBeNull()

  })
})