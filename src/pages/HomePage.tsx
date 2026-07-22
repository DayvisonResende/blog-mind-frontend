import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { articleService } from '@/services/article.service';
import { useAsync } from '@/hooks/useAsync';
import { ArticleCard, ArticleCardSkeleton } from '@/components/article/ArticleCard';
import { NewsletterSection } from '@/components/NewsletterSection';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const { data, loading, error } = useAsync(() => articleService.list({ limit: 8 }), []);

  const articles = data?.items ?? [];
  const featured = articles.slice(0, 4);
  const recent = articles.slice(4, 8);

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 py-20 text-center">
        <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl">
          Explore o Futuro da <span className="text-primary">Tecnologia</span>
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Artigos sobre IA, desenvolvimento, DevOps e as ultimas tendencias tecnologicas.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/artigos">Explorar Artigos</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/cadastro">Comecar a Escrever</Link>
          </Button>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Artigos em Destaque</h2>
            <p className="text-sm text-muted-foreground">Os melhores conteudos selecionados para voce</p>
          </div>
          <Link
            to="/artigos"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="Nao foi possivel carregar os artigos" description={error.message} />
        ) : featured.length === 0 ? (
          <EmptyState
            title="Nenhum artigo ainda"
            description="Seja o primeiro a publicar um artigo."
            action={
              <Button asChild>
                <Link to="/cadastro">Comecar a Escrever</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Recentes */}
      {recent.length > 0 && (
        <section className="py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Artigos Recentes</h2>
            <p className="text-sm text-muted-foreground">Conteudo recente da comunidade</p>
          </div>
          <div className="grid gap-4">
            {recent.map((article) => (
              <ArticleCard key={article.id} article={article} variant="list" />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-12">
        <NewsletterSection />
      </section>
    </div>
  );
}
