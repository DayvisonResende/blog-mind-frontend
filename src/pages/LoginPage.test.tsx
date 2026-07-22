import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

const loginMock = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ login: loginMock }),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  it('mostra erros de validacao ao enviar vazio (nao chama login)', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('Informe seu e-mail')).toBeInTheDocument();
    expect(screen.getByText('Informe sua senha')).toBeInTheDocument();
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('chama login com os dados quando o formulario e valido', async () => {
    loginMock.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText('Email'), 'ana@test.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(loginMock).toHaveBeenCalledWith('ana@test.com', 'senha123');
  });
});
