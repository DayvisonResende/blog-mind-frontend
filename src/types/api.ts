/** Tipos das respostas da API do backend (blog-mind-backend). */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface ArticleAuthor {
  id: string;
  name: string;
  avatar: string | null;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  readingTime: number;
  views: number;
  likesCount: number;
  commentsCount: number;
  author: ArticleAuthor;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isSaved: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedArticles {
  items: Article[];
  meta: PaginationMeta;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: ArticleAuthor;
  likesCount: number;
  liked: boolean;
}

export interface DashboardStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgReadingTime: number;
}

export interface ActivityItem {
  id: string;
  content: string;
  createdAt: string;
  commenter: { name: string; avatar: string | null };
  article: { id: string; title: string };
}

export interface ToggleResult {
  active: boolean;
  count: number;
}

/** Formato padronizado de erro vindo do backend ({ message, code }). */
export interface ApiError {
  message: string;
  code: string;
}
