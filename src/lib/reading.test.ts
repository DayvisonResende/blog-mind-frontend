import { describe, it, expect } from 'vitest';
import { calculateReadingTime, countWords } from './reading';

describe('countWords', () => {
  it('conta palavras ignorando espacos multiplos', () => {
    expect(countWords('uma   duas\n\ntres')).toBe(3);
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });
});

describe('calculateReadingTime', () => {
  it('retorna 0 para conteudo vazio', () => {
    expect(calculateReadingTime('')).toBe(0);
  });

  it('retorna no minimo 1 minuto', () => {
    expect(calculateReadingTime('poucas palavras aqui')).toBe(1);
  });

  it('arredonda para cima (~200 palavras/min)', () => {
    const texto = Array(250).fill('palavra').join(' ');
    expect(calculateReadingTime(texto)).toBe(2);
  });
});
