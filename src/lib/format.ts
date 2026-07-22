import { env } from './env';

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Caminhos locais ("/uploads/x.jpg") recebem o host da API; URLs completas passam direto.
export function resolveImageUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${env.apiUrl}${path}`;
}
