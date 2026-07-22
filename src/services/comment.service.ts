import { api } from './api';
import type { ActivityItem, Comment, ToggleResult } from '@/types/api';

/** Chamadas de comentarios, curtidas de comentario e atividade do dashboard. */
export const commentService = {
  listByArticle: (articleId: string) =>
    api.get<Comment[]>(`/articles/${articleId}/comments`).then((r) => r.data),

  create: (articleId: string, content: string) =>
    api.post<Comment>(`/articles/${articleId}/comments`, { content }).then((r) => r.data),

  remove: (commentId: string) => api.delete(`/comments/${commentId}`).then((r) => r.data),

  toggleLike: (commentId: string) =>
    api.post<ToggleResult>(`/comments/${commentId}/like`).then((r) => r.data),

  recentActivity: () => api.get<ActivityItem[]>('/dashboard/activity').then((r) => r.data),
};
