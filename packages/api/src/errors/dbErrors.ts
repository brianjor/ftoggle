export class RecordDoesNotExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RecordDoesNotExistError';
  }
}
