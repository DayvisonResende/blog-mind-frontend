import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Bookmark, Clock, Eye, Heart, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Article } from '@/types/api';
import { articleService } from '@/services/article.service';
import type { NormalizedError } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, resolveImageUrl } from '@/lib/format';
import { cn } from '@/lib/utils';
import { CategoryBadge } from '@/components/article/CategoryBadge';
import { CommentSection } from '@/components/article/CommentSection';
import { FullScreenLoader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ArticleDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [article, setArticle] = useState<Article>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<NormalizedError>();

  useEffect(() => {
    let active = true;
    setLoading(true);
    articleService
      .getById(id)
      .then((data) => active && setArticle(data))
      .catch((e) => active && setError(e as NormalizedError))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const requireAuth = useCallback((): boolean => {
    if (!isAuthenticated) {
      toast.info('Faca login para interagir com o artigo.');
      navigate('/login', { state: { from: `/artigos/${id}` } });
      return false;
    }
    return true;
  }, [isAuthenticated, navigate, id]);

  const handleLike = async () => {
    if (!article || !requireAuth()) return;
    const previous = article;
    // Atualizacao otimista.
    setArticle({
      ...article,
      isLiked: !article.isLiked,
      likesCount: article.likesCount + (article.isLiked ? -1 : 1),
    });
    try {
      const result = await articleService.toggleLike(article.id);
      setArticle((curr) => (curr ? { ...curr, isLiked: result.active, likesCount: result.count } : curr));
    } catch (e) {
      setArticle(previous); // reverte
      toast.error((e as NormalizedError).message);
    }
  };

  const handleSave = async () => {
    if (!article || !requireAuth()) return;
    const previous = article;
    setArticle({ ...article, isSaved: !article.isSaved });
    try {
      const result = await articleService.toggleSave(article.id);
      setArticle((curr) => (curr ? { ...curr, isSaved: result.active } : curr));
      toast.success(result.active ? 'Artigo salvo!' : 'Artigo removido dos salvos.');
    } catch (e) {
      setArticle(previous);
      toast.error((e as NormalizedError).message);
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copiado para a area de transferencia!');
  };

  if (loading) return <FullScreenLoader />;
  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Artigo nao encontrado"
          description={error?.message ?? 'O artigo que voce procura nao existe.'}
          action={
            <Button asChild>
              <Link to="/artigos">Ver todos os artigos</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const cover = resolveImageUrl(article.coverImage);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/artigos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar aos Artigos
      </Link>

      <CategoryBadge category={article.category} />
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{article.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{article.summary}</p>

      {/* Autor + meta */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y py-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={resolveImageUrl(article.author.avatar)} alt={article.author.name} />
            <AvatarFallback>{article.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{article.author.name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(article.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-4" /> {article.readingTime} min
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Eye className="size-4" /> {article.views}
          </span>
        </div>
      </div>

      {/* Acoes */}
      <div className="mt-4 flex items-center gap-2">
        <Button variant={article.isLiked ? 'default' : 'outline'} size="sm" onClick={handleLike}>
          <Heart className={cn('mr-1 size-4', article.isLiked && 'fill-current')} />
          {article.likesCount}
        </Button>
        <Button variant={article.isSaved ? 'default' : 'outline'} size="sm" onClick={handleSave}>
          <Bookmark className={cn('mr-1 size-4', article.isSaved && 'fill-current')} />
          {article.isSaved ? 'Salvo' : 'Salvar'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-1 size-4" /> Compartilhar
        </Button>
      </div>

      {/* Capa */}
      {cover && (
        <img
          src={cover}
          alt={article.title}
          className="mt-6 aspect-video w-full rounded-lg object-cover"
        />
      )}

      {/* Conteudo em markdown */}
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comentarios */}
      <CommentSection
        articleId={article.id}
        onCountChange={(count) => setArticle((curr) => (curr ? { ...curr, commentsCount: count } : curr))}
      />
    </article>
  );
}
