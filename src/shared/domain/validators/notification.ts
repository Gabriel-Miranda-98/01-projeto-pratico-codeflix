export class Notification<T extends string = string> {
  private errors = new Map<T | string, string[]>();

  addError(error: string, field?: T) {
    const key = field || error;
    const errors = this.errors.get(key) || [];
    if (!errors.includes(error)) {
      errors.push(error);
      this.errors.set(key, errors);
    }
  }

  setError(error: string | string[], field?: T) {
    const key = field || (Array.isArray(error) ? error[0] : error);
    this.errors.set(key, Array.isArray(error) ? error : [error]);
  }

  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  getErrors(): Map<T | string, string[]> {
    return new Map(this.errors);
  }

  copyErrors(notification: Notification<T>) {
    notification.errors.forEach((value, field) => {
      this.setError(value, field as T);
    });
  }

  clear() {
    this.errors.clear();
  }

  toJSON() {
    const errors: Array<{ [key: string]: string[] }> = [];
    this.errors.forEach((value, key) => {
      errors.push({ [key]: value });
    });
    return errors;
  }
}