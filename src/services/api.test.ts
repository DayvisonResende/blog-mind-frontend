import { describe, it, expect } from 'vitest';
import { AxiosError, type AxiosResponse } from 'axios';
import { normalizeError } from './api';

describe('normalizeError', () => {
  it('usa o { message, code } padronizado do backend', () => {
    const response = {
      status: 409,
      data: { message: 'E-mail ja cadastrado', code: 'EMAIL_ALREADY_EXISTS' },
    } as unknown as AxiosResponse;
    const error = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, response);

    const result = normalizeError(error);

    expect(result).toEqual({
      message: 'E-mail ja cadastrado',
      code: 'EMAIL_ALREADY_EXISTS',
      status: 409,
    });
  });

  it('trata erro de rede (sem resposta do servidor)', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK');
    const result = normalizeError(error);

    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.status).toBe(0);
    expect(result.message).toMatch(/conectar/i);
  });

  it('trata erro inesperado (nao-Axios)', () => {
    const result = normalizeError(new Error('boom'));
    expect(result.code).toBe('UNKNOWN');
  });
});
