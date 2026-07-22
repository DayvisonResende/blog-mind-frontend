import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CommentSection } from './CommentSection';
import { commentService } from '@/services/comment.service';
import type { Comment } from '@/types/api';

vi.mock('@/services/comment.service', () => ({
  commentService: {
    listByArticle: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    toggleLike: vi.fn(),
  },
}));

const authState = { isAuthenticated: false, user: null as { id: string } | null };
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => authState,
}));

const sampleComment: Comment = {
  id: 'c1',
  content: 'Otimo artigo!',
  createdAt: '2026-01-01T00:00:00.000Z',
  author: { id: 'u2', name: 'Marie Smith', avatar: null },
  likesCount: 2,
  liked: false,
};

function renderSection() {
  return render(
    <MemoryRouter>
      <CommentSection articleId="a1" />
    </MemoryRouter>,
  );
}

describe('CommentSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.isAuthenticated = false;
    authState.user = null;
    vi.mocked(commentService.listByArticle).mockResolvedValue([sampleComment]);
  });

  it('mostra "Faca login" quando deslogado e nao mostra o formulario', async () => {
    renderSection();
    expect(await screen.findByText('Otimo artigo!')).toBeInTheDocument();
    expect(screen.getByText('Faca login')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Escreva um comentario...')).not.toBeInTheDocument();
  });

  it('mostra o formulario quando logado', async () => {
    authState.isAuthenticated = true;
    authState.user = { id: 'u1' };
    renderSection();
    expect(await screen.findByText('Otimo artigo!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escreva um comentario...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publicar comentario/i })).toBeInTheDocument();
  });

  it('mostra a contagem de comentarios', async () => {
    renderSection();
    expect(await screen.findByText('Comentarios (1)')).toBeInTheDocument();
  });
});
