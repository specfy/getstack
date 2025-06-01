import type { ApiError } from '@getstack/backend/src/types/api';

export class ApiResError extends Error {
  json: ApiError<string>['error'];

  constructor(json: ApiError<string>) {
    super(json.error.code);

    this.json = json.error;
  }
}
