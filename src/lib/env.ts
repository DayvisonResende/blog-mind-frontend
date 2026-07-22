/** Variaveis de ambiente da aplicacao (prefixo VITE_ exigido pelo Vite). */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
};
