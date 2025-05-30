import type { ApiError } from '@getstack/backend/src/types/api';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export class ApiResError extends Error {
  json: ApiError<string>['error'];

  constructor(json: ApiError<string>) {
    super(json.error.code);

    this.json = json.error;
  }
}
