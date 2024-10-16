import { FieldsErrors } from '../core/shared/domain/validators/validator-fields.interface';

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages(expected: FieldsErrors): R;
      notificationContainsErrorMessages(
        received: Array<string | { [key: string]: string[] }>,
      ): R;
    }
  }
}
