import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { THEME_STORAGE_KEY } from './theme-context';

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe('Tema dark/light', () => {
  it('inicia no escuro por padrao (aplica classe dark no html)', () => {
    renderWithProvider();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('alterna para claro ao clicar e persiste no localStorage', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByRole('button'));

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('respeita a preferencia salva no localStorage', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    renderWithProvider();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
