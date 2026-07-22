import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from './AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import { TOKEN_STORAGE_KEY } from '@/services/api';
import { authService } from '@/services/auth.service';

vi.mock('@/services/auth.service', () => ({
  authService: {
    me: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

const fakeUser = {
  id: '1',
  name: 'Ana',
  email: 'ana@test.com',
  avatar: null,
  bio: null,
  role: 'user' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

function Consumer() {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="status">{isAuthenticated ? `logado:${user?.name}` : 'deslogado'}</span>
      <button onClick={() => login('ana@test.com', 'senha123')}>entrar</button>
      <button onClick={logout}>sair</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('faz login, guarda o token e expoe o usuario', async () => {
    vi.mocked(authService.login).mockResolvedValue({ token: 'jwt-123', user: fakeUser });
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('status')).toHaveTextContent('deslogado');
    await user.click(screen.getByText('entrar'));

    expect(screen.getByTestId('status')).toHaveTextContent('logado:Ana');
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('jwt-123');
  });

  it('logout limpa o token e o usuario', async () => {
    vi.mocked(authService.login).mockResolvedValue({ token: 'jwt-123', user: fakeUser });
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await user.click(screen.getByText('entrar'));
    await user.click(screen.getByText('sair'));

    expect(screen.getByTestId('status')).toHaveTextContent('deslogado');
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});
