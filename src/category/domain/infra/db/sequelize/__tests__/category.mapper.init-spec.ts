import { Sequelize } from "sequelize-typescript"
import { CategoryModel } from "../category.model"
import { Category } from "../../../../category.entity"
import { CategoryModelMapper } from "../mappers/category.mapper"
import { EntityValidationError } from "../../../../../../shared/domain/validators/validation.error"
import { setupSequelize } from "../../../../../../shared/infra/testing/helpers"

describe('CategoryMapper Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel],
  })


  it("should throws error when category is invalid", () => {
    const model = CategoryModel.build({
      categoryId: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });
    try {
      CategoryModelMapper.toDomain(model);
      fail(
        "The category is valid, but it needs throws a EntityValidationError"
      );
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).errors).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  })

  it("should convert a category model to a category entity", () => {
    const createdAt = new Date();
    const model = CategoryModel.build({
      categoryId: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      isActive: true,
      createdAt,
    });
    const entity = CategoryModelMapper.toDomain(model);
    expect(entity.toJSON()).toStrictEqual(
      Category.restore({
        categoryId: "5490020a-e866-4229-9adc-aa44b83234c4",
        name: "some value",
        description: "some description",
        isActive: true,
        createdAt,
      }).toJSON()
    );
  });

  it("should convert a category entity to a category model", () => {
    const createdAt = new Date();
    const entity =Category.restore({
      categoryId: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      isActive: true,
      createdAt,
    });
    const model = CategoryModelMapper.toModel(entity);
    expect(model.toJSON()).toStrictEqual({
      categoryId: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      isActive: true,
      createdAt,
    });
  });


})