const WORDS_PER_MINUTE = 200;

/** Conta as palavras de um texto (ignorando espacos multiplos). */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Tempo de leitura estimado em minutos (~200 palavras/min, minimo 1). */
export function calculateReadingTime(text: string): number {
  const words = countWords(text);
  if (words === 0) return 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
