import { Entity } from "../../shared/domain/entity"
import { EntityValidationError } from "../../shared/domain/validators/validation.error"
import { Uuid } from "../../shared/domain/value-objects/uuid.vo"
import { CategoryFakeBuilder } from "./category-fake.builder"
import { CategoryValidatorFactory } from "./category.validator"

export type CategoryConstructorProps={
  categoryId?: Uuid
  name: string
  description?: string|null
  isActive?: boolean
  createdAt?: Date
}

export type CategoryRestoreProps={
  categoryId: string
  name: string
  description: string|null
  isActive: boolean
  createdAt: Date
}

export type CategoryCreateCommand={
  name: string
  description?: string|null
  isActive?: boolean
}
export class Category extends Entity{
 private _categoryId: Uuid
 private _name: string
 private _description: string|null
 private _isActive: boolean
 private _createdAt: Date

constructor(props:CategoryConstructorProps){
    super()
    this._categoryId=props.categoryId?? Uuid.create()
    this._name=props.name
    this._description=props.description?? null
    this._isActive=props.isActive?? true
    this._createdAt=props.createdAt?? new Date()

 }

 get categoryId(){
    return this._categoryId
 }

 get name(){
    return this._name
 }

  get description(){
      return this._description
  }

  get isActive(){
      return this._isActive
  }

  get createdAt(){
      return this._createdAt
  }



 get entityId(){
    return this._categoryId
 }

 static restore(props:CategoryRestoreProps):Category{
  const category = new Category({
    ...props,
    categoryId:Uuid.create(props.categoryId)
  })
  Category.validate(category)
  return category
 }

  static create(props:CategoryCreateCommand):Category{
    const category = new Category(props)
    Category.validate(category)
    return category
  }

  changeName(name:string):void{
    this._name=name
    Category.validate(this)
  }

  changeDescription(description:string|null):void{
    
    this._description=description
    Category.validate(this)
  }

  activate():void{
    this._isActive=true
  }

  deactivate():void{
    this._isActive=false
  }

  static validate(entity:Category){
    const validator = CategoryValidatorFactory.create()
    const isValid =validator.validate(entity)
    if(!isValid){
      throw new EntityValidationError(validator.errors)
    }
  }

  static fake(){
    return CategoryFakeBuilder
  }

  toJSON(){
    return {
      categoryId:this._categoryId.id,
      name:this.name,
      description:this.description,
      isActive:this.isActive,
      createdAt:this.createdAt
    }
  }



}