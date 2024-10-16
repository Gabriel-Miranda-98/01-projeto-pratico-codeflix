import { IsString, MaxLength, validateSync } from 'class-validator';
import { Category } from './category.entity';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/domain/validators/notification';

export class CategoryRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(props: Partial<Category>) {
    Object.assign(this, props);
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(
    notification: Notification,
    entity: CategoryRules,
    fields: Array<keyof CategoryRules>,
  ): boolean {
    const categoryRules = new CategoryRules(entity);
    const validationFields = fields?.length
      ? fields
      : (['name'] as Array<keyof CategoryRules>);
    return super.validate(notification, categoryRules, validationFields);
  }
}

export class CategoryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator();
  }
}
