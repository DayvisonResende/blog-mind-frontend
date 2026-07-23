import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Bookmark, Clock, Eye, Heart, MessageSquare, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Article } from '@/types/api';
import { articleService } from '@/services/article.service';
import type { NormalizedError } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatDate, resolveImageUrl } from '@/lib/format';
import { markArticleViewed } from '@/lib/viewed';
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
  useDocumentTitle(article?.title);

  // evita o duplo fetch do StrictMode (dev), que contava a view 2x
  const requestedIdRef = useRef<string>('');

  useEffect(() => {
    if (requestedIdRef.current === id) return;
    requestedIdRef.current = id;
    setLoading(true);
    setError(undefined);
    articleService
      .getById(id)
      .then((data) => {
        setArticle(data);
        markArticleViewed(data.id);
      })
      .catch((e) => setError(e as NormalizedError))
      .finally(() => setLoading(false));
  }, [id]);

  const requireAuth = useCallback((): boolean => {
    if (!isAuthenticated) {
      toast.info('Faça login para interagir com o artigo.');
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
    const url = window.location.href;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // fallback para contextos nao-seguros (http em rede local, sem HTTPS)
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      toast.success('Link copiado para a área de transferência!');
    } catch {
      toast.error('Não foi possível copiar o link.');
    }
  };

  if (loading) return <FullScreenLoader />;
  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Artigo não encontrado"
          description={error?.message ?? 'O artigo que você procura não existe.'}
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
        className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar aos Artigos
      </Link>

      <div className="mt-8">
        <CategoryBadge category={article.category} variant="solid" />
      </div>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{article.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{article.summary}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={resolveImageUrl(article.author.avatar)} alt={article.author.name} />
            <AvatarFallback>{article.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{article.author.name}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              {formatDate(article.createdAt)} · <Clock className="size-3" /> {article.readingTime}min
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            aria-label="Curtir"
            className={cn(article.isLiked && 'text-primary')}
          >
            <Heart className={cn('size-5', article.isLiked && 'fill-current')} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            aria-label="Salvar"
            className={cn(article.isSaved && 'text-primary')}
          >
            <Bookmark className={cn('size-5', article.isSaved && 'fill-current')} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare} aria-label="Compartilhar">
            <Share2 className="size-5" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-b pb-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Heart className="size-4" /> {article.likesCount} curtidas
        </span>
        <span className="flex items-center gap-1">
          <Eye className="size-4" /> {article.views} visualizações
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="size-4" /> {article.commentsCount} comentários
        </span>
      </div>

      {cover && (
        <img
          src={cover}
          alt={article.title}
          className="mt-6 aspect-video w-full rounded-lg object-cover"
        />
      )}

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>

      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-3 py-1.5 text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <CommentSection
        articleId={article.id}
        onCountChange={(count) => setArticle((curr) => (curr ? { ...curr, commentsCount: count } : curr))}
      />
    </article>
  );
}
