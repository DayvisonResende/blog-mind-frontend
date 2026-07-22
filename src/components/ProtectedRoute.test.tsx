import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const useAuthMock = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}));

function renderAt() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Conteudo Protegido</div>} />
        </Route>
        <Route path="/login" element={<div>Tela de Login</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redireciona para o login quando nao autenticado', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, loading: false });
    renderAt();
    expect(screen.getByText('Tela de Login')).toBeInTheDocument();
    expect(screen.queryByText('Conteudo Protegido')).not.toBeInTheDocument();
  });

  it('mostra o conteudo quando autenticado', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true, loading: false });
    renderAt();
    expect(screen.getByText('Conteudo Protegido')).toBeInTheDocument();
  });
});
