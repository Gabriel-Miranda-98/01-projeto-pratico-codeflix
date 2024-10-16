import { ValueObject } from '../value-object';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
export class Uuid extends ValueObject {
  readonly id: string;
  private constructor(id?: string) {
    super();
    this.id = id || this.generateUuid();
    this.isValidUuid();
  }

  private generateUuid(): string {
    return uuidv4();
  }

  private isValidUuid() {
    const isValidUuid = uuidValidate(this.id);

    if (!isValidUuid) {
      throw new InvalidUuidError();
    }
  }
  static create(id?: string): Uuid {
    return new Uuid(id);
  }

  toString(): string {
    return this.id;
  }
}

export class InvalidUuidError extends Error {
  constructor(message?: string) {
    super(message || 'ID must be a valid UUID');
    this.name = 'InvalidUuidError';
  }
}
