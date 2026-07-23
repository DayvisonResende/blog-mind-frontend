import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ArticleCard } from './ArticleCard';
import type { Article } from '@/types/api';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: false }),
}));

const article: Article = {
  id: 'abc',
  title: 'O Futuro da IA',
  summary: 'Um resumo sobre inteligencia artificial',
  content: '## conteudo',
  coverImage: null,
  category: 'Desenvolvimento web',
  tags: ['ia', 'ts'],
  readingTime: 6,
  views: 122,
  likesCount: 3,
  commentsCount: 2,
  author: { id: 'u1', name: 'John Doe', avatar: null },
  createdAt: '2026-01-04T00:00:00.000Z',
  updatedAt: '2026-01-04T00:00:00.000Z',
  isLiked: false,
  isSaved: false,
};

function renderCard(variant?: 'grid' | 'list') {
  return render(
    <MemoryRouter>
      <ArticleCard article={article} variant={variant} />
    </MemoryRouter>,
  );
}

describe('ArticleCard', () => {
  it('mostra titulo, categoria, autor e tempo de leitura', () => {
    renderCard();
    expect(screen.getByText('O Futuro da IA')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvimento web')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('6min')).toBeInTheDocument();
  });

  it('linka para o detalhe do artigo', () => {
    renderCard();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/artigos/abc');
  });

  it('renderiza na variante lista', () => {
    renderCard('list');
    expect(screen.getByText('O Futuro da IA')).toBeInTheDocument();
  });
});
