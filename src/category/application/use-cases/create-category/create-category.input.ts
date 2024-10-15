import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator";
export type CreateCategoryConstructorProps = 
{
  name: string;
  description?: string|null;
  isActive?: boolean;
}

export class CreateCategoryInput {
  @IsString()  
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description?: string|null;
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(props: CreateCategoryConstructorProps) {
    if(!props) return;
    Object.assign(this, props);
  }

}


export class ValidateCreateCategoryInput {
  static validate(input: CreateCategoryInput) {
    return validateSync(input);
  }
}