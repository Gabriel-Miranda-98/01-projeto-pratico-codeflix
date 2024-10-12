import { Op } from "sequelize";
import { Entity } from "../../../../../shared/domain/entity";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { SearchParams } from "../../../../../shared/domain/repositories/search-params";
import { SearchResult } from "../../../../../shared/domain/repositories/search-result";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../category.entity";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../../repositories/category.repository";
import { CategoryModel } from "./category.model";

export class CategorySequelizeRepository implements ICategoryRepository{
  constructor(private categoryModel: typeof CategoryModel){}
  sortableFields: string[]=['name','createdAt'];
 
  async insert(entity: Category): Promise<void> {
   await this.categoryModel.create({
      categoryId:entity.categoryId.id,
      name:entity.name,
      description:entity.description,
      isActive:entity.isActive,
     createdAt:entity.createdAt
   })
  }
  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(entities.map(entity=>({
      categoryId:entity.categoryId.id,
      name:entity.name,
      description:entity.description,
      isActive:entity.isActive,
      createdAt:entity.createdAt
    })))
    
  }
  async update(entity: Category): Promise<void> {
   await this.validateExisteCategory(entity.categoryId)
   await this.categoryModel.update({
      name:entity.name,
      description:entity.description,
      isActive:entity.isActive
    },{
      where:{
        categoryId:entity.categoryId.id
      }
    })
  }
  async delete(entity: Category): Promise<void> {
    await this.validateExisteCategory(entity.categoryId)
    await this.categoryModel.destroy({
      where:{
        categoryId:entity.categoryId.id
      }
    })
  }
 async  findById(categoryId: Uuid): Promise<Category|null> {
    const category = await this.categoryModel.findByPk(categoryId.id)
    if(!category) return null
    return new Category({
      categoryId:Uuid.create(category.categoryId),
      name:category.name,
      description:category.description,
      isActive:category.isActive,
      createdAt:category.createdAt
    })
  }
  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.findAll()
    return categories.map(category=>new Category({
      categoryId:Uuid.create(category.categoryId),
      name:category.name,
      description:category.description,
      isActive:category.isActive,
      createdAt:category.createdAt
    }))
  }
  getEntity(): new (...args: any[]) => Category {
    return Category
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const { page, per_page, filter, sort, sort_dir } = props;
    const offset = (page - 1) * per_page;
    const limit = per_page;

    const whereClause = filter ? { name: { [Op.like]: `%${filter}%` } } : {};
    const orderClause = this.getOrderClause(sort, sort_dir);


    const { rows: categories, count } = await this.categoryModel.findAndCountAll({
      where: whereClause,
      order: orderClause,
      offset,
      limit
    });

    
   return new CategorySearchResult({
    items:categories.map(category=>new Category({
      categoryId:Uuid.create(category.categoryId),
      name:category.name,
      description:category.description,
      isActive:category.isActive,
      createdAt:category.createdAt
    })
  ),
  current_page:props.page,
  per_page:props.per_page,
  total:count
   })
  }

  private async validateExisteCategory (entityId:Uuid):Promise<void>{
    const id = entityId.id.toString()
    const category = await this.categoryModel.findByPk(id)
    if(!category) throw new NotFoundError(id,this.getEntity())
    
  }

  private getOrderClause(sort?: string, sort_dir?: string): any[] {
    if (sort && this.sortableFields.includes(sort)) {
      return [[sort, sort_dir]];
    }
    return [['createdAt', 'desc']];
  }
 
 
} 