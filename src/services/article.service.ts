import { api } from './api';
import type {
  Article,
  DashboardStats,
  PaginatedArticles,
  ToggleResult,
} from '@/types/api';

export interface ListArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const articleService = {
  list: (params: ListArticlesParams = {}) =>
    api.get<PaginatedArticles>('/articles', { params }).then((r) => r.data),

  getById: (id: string) => api.get<Article>(`/articles/${id}`).then((r) => r.data),

  categories: () => api.get<string[]>('/categories').then((r) => r.data),

  create: (data: FormData) => api.post<Article>('/articles', data).then((r) => r.data),

  update: (id: string, data: FormData) =>
    api.put<Article>(`/articles/${id}`, data).then((r) => r.data),

  remove: (id: string) => api.delete(`/articles/${id}`).then((r) => r.data),

  mine: () => api.get<Article[]>('/users/me/articles').then((r) => r.data),

  saved: () => api.get<Article[]>('/users/me/saves').then((r) => r.data),

  stats: () => api.get<DashboardStats>('/dashboard/stats').then((r) => r.data),

  toggleSave: (id: string) =>
    api.post<{ active: boolean }>(`/articles/${id}/save`).then((r) => r.data),

  toggleLike: (id: string) =>
    api.post<ToggleResult>(`/articles/${id}/like`).then((r) => r.data),
};
