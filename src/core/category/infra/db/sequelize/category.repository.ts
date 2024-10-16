import { Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../../../domain/repositories/category.repository';
import { CategoryModel } from './category.model';
import { CategoryModelMapper } from './mappers/category.mapper';

export class CategorySequelizeRepository implements ICategoryRepository {
  constructor(private categoryModel: typeof CategoryModel) {}
  sortableFields: string[] = ['name', 'createdAt'];

  async insert(entity: Category): Promise<void> {
    const categoryToModel = CategoryModelMapper.toModel(entity);
    await this.categoryModel.create(categoryToModel.toJSON());
  }
  async bulkInsert(entities: Category[]): Promise<void> {
    const categoriesToModel = entities.map((entity) =>
      CategoryModelMapper.toModel(entity),
    );
    await this.categoryModel.bulkCreate(
      categoriesToModel.map((c) => c.toJSON()),
    );
  }
  async update(entity: Category): Promise<void> {
    await this.validateExisteCategory(entity.categoryId);
    const categoryToModel = CategoryModelMapper.toModel(entity);
    await this.categoryModel.update(categoryToModel.toJSON(), {
      where: {
        categoryId: entity.categoryId.id,
      },
    });
  }
  async delete(entityId: Uuid): Promise<void> {
    await this.validateExisteCategory(entityId);
    await this.categoryModel.destroy({
      where: {
        categoryId: entityId.id,
      },
    });
  }
  async findById(categoryId: Uuid): Promise<Category | null> {
    const category = await this.categoryModel.findByPk(categoryId.id);
    if (!category) return null;
    return CategoryModelMapper.toDomain(category);
  }
  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.findAll();
    return categories.map(CategoryModelMapper.toDomain);
  }
  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const { page, per_page, filter, sort, sort_dir } = props;
    const offset = (page - 1) * per_page;
    const limit = per_page;

    const whereClause = filter ? { name: { [Op.like]: `%${filter}%` } } : {};
    const orderClause = this.getOrderClause(sort, sort_dir);

    const { rows: categories, count } =
      await this.categoryModel.findAndCountAll({
        where: whereClause,
        order: orderClause,
        offset,
        limit,
      });

    return new CategorySearchResult({
      items: categories.map(CategoryModelMapper.toDomain),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private async validateExisteCategory(entityId: Uuid): Promise<void> {
    const id = entityId.id.toString();
    const category = await this.categoryModel.findByPk(id);
    if (!category) throw new NotFoundError(id, this.getEntity());
  }

  private getOrderClause(sort?: string, sort_dir?: string): any[] {
    if (sort && this.sortableFields.includes(sort)) {
      return [[sort, sort_dir]];
    }
    return [['createdAt', 'desc']];
  }
}
