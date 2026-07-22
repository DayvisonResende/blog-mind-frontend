import axios, { AxiosError } from 'axios';
import { env } from '@/lib/env';
import type { ApiError } from '@/types/api';

export const TOKEN_STORAGE_KEY = 'blog-mind-token';

export interface NormalizedError {
  message: string;
  code: string;
  status: number;
}

export const api = axios.create({
  baseURL: env.apiUrl,
});

// Request: injeta o JWT em toda requisicao, se houver.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function normalizeError(error: unknown): NormalizedError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    const data = axiosError.response?.data;
    if (data?.message) {
      return {
        message: data.message,
        code: data.code ?? 'UNKNOWN',
        status: axiosError.response?.status ?? 0,
      };
    }
    // Sem resposta do servidor => provavel erro de rede.
    if (!axiosError.response) {
      return {
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
        code: 'NETWORK_ERROR',
        status: 0,
      };
    }
    return {
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      code: 'UNKNOWN',
      status: axiosError.response.status,
    };
  }
  return { message: 'Ocorreu um erro inesperado. Tente novamente.', code: 'UNKNOWN', status: 0 };
}

// Response: normaliza os erros para um formato consistente.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeError(error)),
);
