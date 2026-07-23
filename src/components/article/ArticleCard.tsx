import { useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Check, Clock, Eye, Heart } from 'lucide-react';
import { toast } from 'sonner';
import type { Article } from '@/types/api';
import { articleService } from '@/services/article.service';
import type { NormalizedError } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { formatDate, resolveImageUrl } from '@/lib/format';
import { getViewedArticles } from '@/lib/viewed';
import { CategoryBadge } from './CategoryBadge';

interface ArticleCardProps {
  article: Article;
  variant?: 'grid' | 'list' | 'compact';
}

function Cover({
  article,
  className,
  dimmed,
}: {
  article: Article;
  className?: string;
  dimmed?: boolean;
}) {
  const src = resolveImageUrl(article.coverImage);
  return (
    <div className={cn('overflow-hidden bg-muted', className)}>
      {src ? (
        <img
          src={src}
          alt={article.title}
          loading="lazy"
          className={cn('h-full w-full object-cover', dimmed && 'opacity-60')}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-mono text-2xl font-bold text-muted-foreground/40">
          &lt;M/&gt;
        </div>
      )}
    </div>
  );
}

function TopRow({ article, viewed }: { article: Article; viewed: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <CategoryBadge category={article.category} />
      <span className="flex items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">
        {viewed && (
          <span className="flex items-center gap-1 font-medium text-primary">
            <Check className="size-3" /> Visto
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> {formatDate(article.createdAt)}
        </span>
      </span>
    </div>
  );
}

export function ArticleCard({ article, variant = 'grid' }: ArticleCardProps) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(article.isLiked);
  const [saved, setSaved] = useState(article.isSaved);
  const [likesCount, setLikesCount] = useState(article.likesCount);
  const [hasViewed] = useState(() => getViewedArticles().has(article.id));
  // "Visto" so vale para quem esta logado.
  const viewed = isAuthenticated && hasViewed;

  const toggleLike = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(likesCount + (liked ? -1 : 1));
    try {
      const result = await articleService.toggleLike(article.id);
      setLiked(result.active);
      setLikesCount(result.count);
    } catch (err) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error((err as NormalizedError).message);
    }
  };

  const toggleSave = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prev = saved;
    setSaved(!saved);
    try {
      const result = await articleService.toggleSave(article.id);
      setSaved(result.active);
      toast.success(result.active ? 'Artigo salvo!' : 'Removido dos salvos.');
    } catch (err) {
      setSaved(prev);
      toast.error((err as NormalizedError).message);
    }
  };

  const footer = (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate text-xs text-muted-foreground">{article.author.name}</span>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> {article.readingTime}min
        </span>
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" /> {article.views}
        </span>
        {isAuthenticated ? (
          <>
            <button
              type="button"
              onClick={toggleLike}
              aria-label={liked ? 'Descurtir' : 'Curtir'}
              className={cn(
                'flex items-center gap-1 transition-colors hover:text-foreground',
                liked && 'text-primary',
              )}
            >
              <Heart className={cn('size-3.5', liked && 'fill-current')} /> {likesCount}
            </button>
            <button
              type="button"
              onClick={toggleSave}
              aria-label={saved ? 'Remover dos salvos' : 'Salvar'}
              className={cn(
                'transition-colors hover:text-foreground',
                saved && 'text-blue-500',
              )}
            >
              <Bookmark className={cn('size-3.5', saved && 'fill-current')} />
            </button>
          </>
        ) : (
          <span className="flex items-center gap-1">
            <Heart className="size-3.5" /> {likesCount}
          </span>
        )}
      </div>
    </div>
  );

  const cardBase =
    'flex rounded-lg border bg-card transition-colors hover:border-primary/50';
  const viewedClass = viewed ? 'border-primary/30' : '';

  if (variant === 'compact') {
    return (
      <Link
        to={`/artigos/${article.id}`}
        className={cn(cardBase, 'flex-col gap-2 p-4', viewedClass)}
      >
        <TopRow article={article} viewed={viewed} />
        <h3 className="line-clamp-2 font-bold">{article.title}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{article.summary}</p>
        {footer}
      </Link>
    );
  }

  if (variant === 'list') {
    return (
      <Link to={`/artigos/${article.id}`} className={cn(cardBase, 'gap-5 p-4', viewedClass)}>
        <Cover
          article={article}
          dimmed={viewed}
          className="hidden aspect-[3/2] w-52 shrink-0 rounded-md sm:block"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <TopRow article={article} viewed={viewed} />
          <h3 className="line-clamp-1 text-lg font-bold">{article.title}</h3>
          <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{article.summary}</p>
          {footer}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/artigos/${article.id}`}
      className={cn(cardBase, 'flex-col overflow-hidden', viewedClass)}
    >
      <Cover article={article} dimmed={viewed} className="aspect-video" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <TopRow article={article} viewed={viewed} />
        <h3 className="line-clamp-2 font-bold">{article.title}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{article.summary}</p>
        {footer}
      </div>
    </Link>
  );
}

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
