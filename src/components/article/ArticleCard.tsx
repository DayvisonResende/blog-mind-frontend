import { Link } from 'react-router-dom';
import { Clock, Eye, Heart } from 'lucide-react';
import type { Article } from '@/types/api';
import { cn } from '@/lib/utils';
import { formatDate, resolveImageUrl } from '@/lib/format';
import { CategoryBadge } from './CategoryBadge';

interface ArticleCardProps {
  article: Article;
  variant?: 'grid' | 'list' | 'compact';
}

function Cover({ article, className }: { article: Article; className?: string }) {
  const src = resolveImageUrl(article.coverImage);
  return (
    <div className={cn('overflow-hidden bg-muted', className)}>
      {src ? (
        <img src={src} alt={article.title} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-mono text-2xl font-bold text-muted-foreground/40">
          &lt;M/&gt;
        </div>
      )}
    </div>
  );
}

/** Linha superior: badge de categoria (esquerda) e data (direita). */
function TopRow({ article }: { article: Article }) {
  return (
    <div className="flex items-center justify-between">
      <CategoryBadge category={article.category} />
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="size-3.5" /> {formatDate(article.createdAt)}
      </span>
    </div>
  );
}

/** Linha inferior: autor (esquerda) e estatisticas (direita). */
function BottomRow({ article }: { article: Article }) {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{article.author.name}</span>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> {article.readingTime}min
        </span>
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" /> {article.views}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="size-3.5" /> {article.likesCount}
        </span>
      </div>
    </div>
  );
}

/** Card de artigo, com layout em grade (vertical), lista (horizontal) ou compacto (sem capa). */
export function ArticleCard({ article, variant = 'grid' }: ArticleCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/artigos/${article.id}`}
        className="flex flex-col gap-2 rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
      >
        <TopRow article={article} />
        <h3 className="line-clamp-2 font-bold">{article.title}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{article.summary}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{article.author.name}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> {formatDate(article.createdAt)}
          </span>
        </div>
      </Link>
    );
  }

  if (variant === 'list') {
    return (
      <Link
        to={`/artigos/${article.id}`}
        className="flex gap-5 rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
      >
        <Cover
          article={article}
          className="hidden aspect-[3/2] w-52 shrink-0 rounded-md sm:block"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <TopRow article={article} />
          <h3 className="line-clamp-1 text-lg font-bold">{article.title}</h3>
          <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{article.summary}</p>
          <BottomRow article={article} />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/artigos/${article.id}`}
      className="flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/50"
    >
      <Cover article={article} className="aspect-video" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <TopRow article={article} />
        <h3 className="line-clamp-2 font-bold">{article.title}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{article.summary}</p>
        <BottomRow article={article} />
      </div>
    </Link>
  );
}

/** Esqueleto de carregamento no formato do card. */
export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <div className="aspect-video animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-5 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
