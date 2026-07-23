const STORAGE_KEY = 'blog-mind-viewed';

export function getViewedArticles(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function markArticleViewed(id: string): void {
  try {
    const viewed = getViewedArticles();
    if (viewed.has(id)) return;
    viewed.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewed]));
  } catch {
    // localStorage indisponivel: ignora
  }
}
