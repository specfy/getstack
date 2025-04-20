export interface ApiError<TCode extends string, TErrors = unknown> {
  error: {
    code: TCode;
    reason?: string | undefined;
    errors?: TErrors;
  };
}
export interface ValidationError {
  code: string;
  message: string;
  path: (number | string)[];
}

export type ResDefaultErrors =
  | ApiError<'404_not_found'>
  | ApiError<'500_server_error'>
  | ApiError<'forbidden'>;

export type EndpointMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
/**
 * API Request/Response type
 */
export interface EndpointDefinition {
  Method: EndpointMethod;
  Path: string;
  Params?: Record<string, unknown>;
  Body?: Record<string, unknown>;
  Headers?: Record<string, unknown>;
  Querystring?: Record<string, unknown>;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  Error?: ApiError<string> | never;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  Success: never | Record<string, unknown>;
}
export interface Endpoint<T extends EndpointDefinition> {
  // ------------
  // ------------ Request
  Method: T['Method'];
  Path: T['Path'];
  /**
   * URL params
   */
  Params: T['Params'] extends Record<string, unknown> ? T['Params'] : never;

  /**
   * URL query string
   */
  Querystring: T['Querystring'] extends Record<string, unknown> ? T['Querystring'] : never;

  /**
   * Helpers: Querystring + Params
   */
  QP: (T['Params'] extends Record<string, unknown> ? T['Params'] : never) &
    (T['Querystring'] extends Record<string, unknown> ? T['Querystring'] : never);

  /**
   * Received body
   */
  Body: T['Body'] extends Record<string, unknown> ? T['Body'] : never;

  /**
   * Received headers
   */
  Headers: T['Headers'] extends Record<string, unknown> ? T['Headers'] : never;

  // ------------
  // ------------ Response
  /**
   * Response body for success
   */
  Success: T['Success'];

  /**
   * Response body for any error
   */
  Errors: T['Error'] extends { error: unknown } ? ResDefaultErrors | T['Error'] : ResDefaultErrors;

  /**
   * Response body (success + error)
   */
  Reply:
    | ResDefaultErrors
    | (T['Error'] extends ApiError<string> ? T['Error'] | T['Success'] : T['Success']);
}
