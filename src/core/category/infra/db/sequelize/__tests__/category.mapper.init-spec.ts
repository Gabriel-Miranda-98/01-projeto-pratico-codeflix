import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { Category } from '../../../../domain/category.entity';
import { CategoryModelMapper } from '../mappers/category.mapper';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CategoryMapper Integration Tests', () => {
  setupSequelize({
    models: [CategoryModel],
  });
  it('should throw error when category is invalid', () => {
    const categoryModel = CategoryModel.build({
      categoryId: 'f47b1b3e-7b4b-4b1b-8e4e-0b1f7d3e1b1b',
      name: null as any,
    });

    let thrownError: EntityValidationError;

    try {
      CategoryModelMapper.toDomain(categoryModel);
    } catch (error) {
      thrownError = error as EntityValidationError;
    }

    if (thrownError) {
      expect(thrownError).toBeInstanceOf(EntityValidationError);
      expect((thrownError as EntityValidationError).error).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: ['name must be shorter than or equal to 255 characters'],
          }),
        ]),
      );
    } else {
      fail(
        'Expected CategoryModelMapper.toDomain to throw an error, but it did not',
      );
    }
  });

  it('should return a category when category is valid', async () => {
    const createdAt = new Date();
    const categoryModel = CategoryModel.build({
      //generate valid uuid
      categoryId: 'f47b1b3e-7b4b-4b1b-8e4e-0b1f7d3e1b1b',
      name: 'Category Name',
      description: 'Category Description',
      isActive: true,
      createdAt,
    });

    const category = CategoryModelMapper.toDomain(categoryModel);
    expect(category).toBeInstanceOf(Category);
    expect(category.categoryId.id).toBe(categoryModel.categoryId);
    expect(category.name).toBe(categoryModel.name);
    expect(category.description).toBe(categoryModel.description);
    expect(category.isActive).toBe(categoryModel.isActive);
    expect(category.createdAt).toBe(categoryModel.createdAt);
    //expect(category.notification.hasErrors()).toBeFalsy()
  });

  it('should return a category model when category is valid', async () => {
    const category = Category.fake()
      .aCategory()
      .withName('teste')
      .withDescription('teste')
      .build();
    const categoryModel = CategoryModelMapper.toModel(category);
    expect(categoryModel).toBeInstanceOf(CategoryModel);
    expect(categoryModel.categoryId).toBe(category.categoryId.id);
    expect(categoryModel.name).toBe(category.name);
    expect(categoryModel.description).toBe(category.description);
    expect(categoryModel.isActive).toBe(category.isActive);
    expect(categoryModel.createdAt).toBe(category.createdAt);
  });
});
