import type { ApiError } from '../types/api.js';
import type { FastifyReply } from 'fastify';

export async function notFound(res: FastifyReply, message?: string): Promise<void> {
  const err: ApiError<'404_not_found'> = {
    error: {
      code: '404_not_found',
      reason: message,
    },
  };
  return res.status(404).send(err);
}

export async function serverError(res: FastifyReply): Promise<void> {
  const err: ApiError<'500_server_error'> = {
    error: {
      code: '500_server_error',
    },
  };
  return res.status(500).send(err);
}
