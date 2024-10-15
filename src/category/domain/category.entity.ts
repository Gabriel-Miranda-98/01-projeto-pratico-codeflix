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

type ValidatableFields = Omit<CategoryConstructorProps,'categoryId'|'createdAt'|'description'|'isActive'>

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
    categoryId:Uuid.create(props.categoryId),
    name:props.name,
    description:props.description,
    isActive:props.isActive,
    createdAt:props.createdAt,

    
  })


  category.validate()


  return category
 }

  static create(props:CategoryCreateCommand):Category{
    const category = new Category(props)
    category.validate(["name"])
    return category
  }

  changeName(name:string):void{
    this._name=name
    this.validate(["name"])
  }

  changeDescription(description:string|null):void{
    
    this._description=description

  }

  activate():void{
    this._isActive=true
  }

  deactivate():void{
    this._isActive=false
  }

   validate(fields?:Array<keyof ValidatableFields>){
    const validator = CategoryValidatorFactory.create()
    return validator.validate(this.notification,this.toJSON(),fields)
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