import { env } from './env';

/** Formata uma data ISO para o padrao brasileiro (dd/mm/aaaa). */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Resolve a URL de uma imagem. Capas ficam no backend como caminho relativo
 * ("/uploads/x.jpg") e precisam do host da API; avatares podem ser URLs completas.
 */
export function resolveImageUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${env.apiUrl}${path}`;
}
