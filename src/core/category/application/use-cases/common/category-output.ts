import { Category } from '../../../domain/category.entity';

export type CategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
};

export class CategoryOutputMapper {
  static toOutput(category: Category): CategoryOutput {
    const { categoryId, ...otherProps } = category.toJSON();
    return {
      id: category.categoryId.id,
      ...otherProps,
    };
  }
}
