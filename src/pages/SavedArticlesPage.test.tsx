import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SavedArticlesPage } from './SavedArticlesPage';
import { articleService } from '@/services/article.service';
import type { Article } from '@/types/api';

vi.mock('@/services/article.service', () => ({
  articleService: { saved: vi.fn() },
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

const sample: Article = {
  id: 'a1',
  title: 'Artigo Salvo de Teste',
  summary: 'Um resumo qualquer',
  content: 'Conteudo',
  coverImage: null,
  category: 'Backend',
  tags: [],
  readingTime: 3,
  views: 10,
  likesCount: 2,
  commentsCount: 0,
  author: { id: 'u1', name: 'John Doe', avatar: null },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  isLiked: false,
  isSaved: true,
};

function renderPage() {
  return render(
    <MemoryRouter>
      <SavedArticlesPage />
    </MemoryRouter>,
  );
}

describe('SavedArticlesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lista os artigos salvos do usuario', async () => {
    vi.mocked(articleService.saved).mockResolvedValue([sample]);
    renderPage();
    expect(await screen.findByText('Artigo Salvo de Teste')).toBeInTheDocument();
  });

  it('mostra estado vazio quando nao ha salvos', async () => {
    vi.mocked(articleService.saved).mockResolvedValue([]);
    renderPage();
    expect(await screen.findByText('Nenhum artigo salvo ainda')).toBeInTheDocument();
  });
});
