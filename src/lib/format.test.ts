import { describe, it, expect } from 'vitest';
import { resolveImageUrl } from './format';
import { env } from './env';

describe('resolveImageUrl', () => {
  it('retorna undefined para null', () => {
    expect(resolveImageUrl(null)).toBeUndefined();
  });

  it('mantem URLs absolutas (avatares externos)', () => {
    const url = 'https://images.unsplash.com/photo-123';
    expect(resolveImageUrl(url)).toBe(url);
  });

  it('prefixa o host da API em caminhos relativos (capas)', () => {
    expect(resolveImageUrl('/uploads/x.jpg')).toBe(`${env.apiUrl}/uploads/x.jpg`);
  });
});
