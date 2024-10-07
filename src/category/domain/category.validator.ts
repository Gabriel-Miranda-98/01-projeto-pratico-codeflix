import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, validateSync } from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";

class CategoryRules{
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name:string;
  @IsString()
  @IsOptional()
  description:string;
  @IsBoolean()
  @IsOptional()
  isActive:boolean;

  constructor({name, description, isActive}:Category){
    Object.assign(this, {name, description, isActive});
  }
}

class CategoryValidator extends ClassValidatorFields<CategoryRules>{
 validate(entity:Category){
    return super.validate(new CategoryRules(entity));
 }
  
}


export class CategoryValidatorFactory{
  static create(){
    return new CategoryValidator();
  }
}