import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renderiza titulo e descricao', () => {
    render(<EmptyState title="Nenhum artigo" description="Comece a escrever o primeiro" />);
    expect(screen.getByText('Nenhum artigo')).toBeInTheDocument();
    expect(screen.getByText('Comece a escrever o primeiro')).toBeInTheDocument();
  });

  it('renderiza acao quando fornecida', () => {
    render(<EmptyState title="Vazio" action={<button>Criar</button>} />);
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument();
  });
});
