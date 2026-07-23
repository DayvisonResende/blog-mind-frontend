import { useEffect, useState } from 'react';
import { Filter, LayoutGrid, List, Search } from 'lucide-react';
import { articleService } from '@/services/article.service';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ArticleCard, ArticleCardSkeleton } from '@/components/article/ArticleCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const ALL = 'all';

type ViewMode = 'grid' | 'list';

export function ArticlesPage() {
  useDocumentTitle('Artigos');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState<ViewMode>('grid');

  const search = useDebounce(searchInput);

  // Volta para a primeira pagina quando muda a busca ou o filtro.
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const { data: categories } = useAsync(() => articleService.categories(), []);
  const { data, loading, error } = useAsync(
    () => articleService.list({ page, limit: 9, search: search || undefined, category: category || undefined }),
    [page, search, category],
  );

  const articles = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Todos os Artigos</h1>
      <p className="mt-1 text-muted-foreground">
        Explore nossa coleção completa de artigos técnicos
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar artigos..."
            aria-label="Buscar artigos"
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={category || ALL}
            onValueChange={(value) => setCategory(value === ALL ? '' : value)}
          >
            <SelectTrigger className="w-full sm:w-56" aria-label="Filtrar por categoria">
              <Filter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas as categorias</SelectItem>
              {categories?.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 border p-1">
          <button
            aria-label="Visao em grade"
            onClick={() => setView('grid')}
            className={cn(
              'rounded-sm p-1.5 transition-colors',
              view === 'grid'
                ? 'bg-category text-category-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            aria-label="Visao em lista"
            onClick={() => setView('list')}
            className={cn(
              'rounded-sm p-1.5 transition-colors',
              view === 'list'
                ? 'bg-category text-category-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <List className="size-4" />
          </button>
          </div>
        </div>
      </div>

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
            title="Nenhum artigo encontrado"
            description="Tente ajustar a busca ou o filtro de categoria."
          />
        ) : view === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="list" />
            ))}
          </div>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {meta.page} de {meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
