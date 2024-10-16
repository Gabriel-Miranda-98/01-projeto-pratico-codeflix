import { Notification } from './notification';

export type FieldsErrors =
  | {
      [field: string]: string[];
    }
  | string;
export interface IValidatorFields<PropsValidated> {
  validate(
    notification: Notification,
    data: PropsValidated,
    fields: Array<keyof PropsValidated>,
  ): boolean;
}
