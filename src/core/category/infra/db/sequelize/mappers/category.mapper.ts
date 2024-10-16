import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../../domain/category.entity';
import { CategoryModel } from '../category.model';

export class CategoryModelMapper {
  static toModel(category: Category): CategoryModel {
    return CategoryModel.build({
      categoryId: category.categoryId.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      createdAt: category.createdAt,
    });
  }

  static toDomain(categoryModel: CategoryModel): Category {
    const category = Category.restore({
      categoryId: categoryModel.categoryId,
      name: categoryModel.name,
      description: categoryModel.description,
      isActive: categoryModel.isActive,
      createdAt: categoryModel.createdAt,
    });
    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    return category;
  }
}
