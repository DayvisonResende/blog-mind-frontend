import { api } from './api';
import type { AuthResult, User } from '@/types/api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
}

/** Chamadas de autenticacao e perfil ao backend. */
export const authService = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResult>('/auth/register', payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    api.post<AuthResult>('/auth/login', payload).then((r) => r.data),

  me: () => api.get<User>('/auth/me').then((r) => r.data),

  updateProfile: (payload: UpdateProfilePayload) =>
    api.put<User>('/users/me', payload).then((r) => r.data),
};
