import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { articleService } from '@/services/article.service';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ArticleCard, ArticleCardSkeleton } from '@/components/article/ArticleCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';

export function SavedArticlesPage() {
  useDocumentTitle('Salvos');
  const { data, loading, error } = useAsync(() => articleService.saved(), []);
  const articles = data ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar ao Dashboard
      </Link>

      <h1 className="text-3xl font-bold">Artigos Salvos</h1>
      <p className="mt-1 text-muted-foreground">Os artigos que você salvou para ler depois</p>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Erro ao carregar" description={error.message} />
        ) : articles.length === 0 ? (
          <EmptyState
            title="Nenhum artigo salvo ainda"
            description="Toque no ícone de marcador em um artigo para salvá-lo e encontrá-lo aqui."
            action={
              <Button asChild>
                <Link to="/artigos">Explorar artigos</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
