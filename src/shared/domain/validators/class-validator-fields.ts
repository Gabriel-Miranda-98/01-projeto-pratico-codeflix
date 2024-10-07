import { validateSync } from "class-validator"
import { FieldsErrors, IValidatorFields } from "./validator-fields.interface"

export abstract class ClassValidatorFields<PropsValidated> implements IValidatorFields<PropsValidated> {
  errors: FieldsErrors | null = null
  validatedData: PropsValidated | null = null

  validate(data: any): boolean {
    const errors = validateSync(data)
    if (errors.length > 0) {
      this.errors = errors.reduce((acc, error) => {
        const { property, constraints } = error
        if (property) {
          acc[property] = Object.values(constraints)
        }
        return acc
      }, {} as FieldsErrors)
      return false
    }
    this.validatedData = data
    return true
  }
}