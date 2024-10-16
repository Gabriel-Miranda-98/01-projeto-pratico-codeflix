import { validateSync } from "class-validator"
import { FieldsErrors, IValidatorFields } from "./validator-fields.interface"
import { Notification } from "./notification"

export abstract class ClassValidatorFields<PropsValidated> implements IValidatorFields<PropsValidated> {
  validate(notification:Notification,data:PropsValidated, fields:Array<keyof PropsValidated>):boolean{
    const errors = validateSync(data as any, {groups:fields})
    if(errors.length){
      errors.forEach(error=>{
        const field = error.property
        const constraints = Object.values(error.constraints)
        constraints.forEach(constraint=>{
          notification.addError(constraint,field)
        })
      })
      return false
    }
    return true
  }
}