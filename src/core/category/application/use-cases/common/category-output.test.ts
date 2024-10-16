import { CategoryOutputMapper } from './category-output';
import { Category } from '../../../domain/category.entity';

describe('CategoryOutputMapper', () => {
  it('should map Category to CategoryOutput correctly', () => {
    const mockCategory = Category.fake().aCategory().build();
    const spyToJSON = jest.spyOn(mockCategory, 'toJSON');
    const expectedOutput = {
      id: mockCategory.categoryId.id,
      name: mockCategory.name,
      description: mockCategory.description,
      isActive: mockCategory.isActive,
      createdAt: mockCategory.createdAt,
    };

    const output = CategoryOutputMapper.toOutput(mockCategory);
    expect(output).toEqual(expectedOutput);
    expect(spyToJSON).toHaveBeenCalledTimes(1);
  });

  it('should handle null description correctly', () => {
    const mockCategory = Category.fake()
      .aCategory()
      .withDescription(null)
      .build();
    const spyToJSON = jest.spyOn(mockCategory, 'toJSON');

    const expectedOutput = {
      id: mockCategory.categoryId.id,
      name: mockCategory.name,
      description: mockCategory.description,
      isActive: mockCategory.isActive,
      createdAt: mockCategory.createdAt,
    };

    const output = CategoryOutputMapper.toOutput(mockCategory);
    expect(output).toEqual(expectedOutput);
    expect(spyToJSON).toHaveBeenCalledTimes(1);
  });
});
