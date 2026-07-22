import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Comment } from '@/types/api';
import { commentService } from '@/services/comment.service';
import type { NormalizedError } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, resolveImageUrl } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentSectionProps {
  articleId: string;
  onCountChange?: (count: number) => void;
}

export function CommentSection({ articleId, onCountChange }: CommentSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    commentService
      .listByArticle(articleId)
      .then((data) => active && setComments(data))
      .catch((e) => active && toast.error((e as NormalizedError).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [articleId]);

  const updateCount = (list: Comment[]) => onCountChange?.(list.length);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const created = await commentService.create(articleId, content);
      const next = [created, ...comments];
      setComments(next);
      updateCount(next);
      setContent('');
    } catch (err) {
      toast.error((err as NormalizedError).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (comment: Comment) => {
    const previous = comments;
    const next = comments.map((c) =>
      c.id === comment.id
        ? { ...c, liked: !c.liked, likesCount: c.likesCount + (c.liked ? -1 : 1) }
        : c,
    );
    setComments(next); // otimista
    try {
      const result = await commentService.toggleLike(comment.id);
      setComments((curr) =>
        curr.map((c) => (c.id === comment.id ? { ...c, liked: result.active, likesCount: result.count } : c)),
      );
    } catch (err) {
      setComments(previous);
      toast.error((err as NormalizedError).message);
    }
  };

  const handleDelete = async (comment: Comment) => {
    const previous = comments;
    const next = comments.filter((c) => c.id !== comment.id);
    setComments(next);
    updateCount(next);
    try {
      await commentService.remove(comment.id);
      toast.success('Comentário removido.');
    } catch (err) {
      setComments(previous);
      toast.error((err as NormalizedError).message);
    }
  };

  return (
    <section id="comentarios" className="mt-12 border-t pt-8">
      <h2 className="text-xl font-bold">Comentários ({comments.length})</h2>

      {/* Formulario ou aviso de login */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <Textarea
            placeholder="Escreva um comentário..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !content.trim()}>
              {submitting ? 'Publicando...' : 'Publicar Comentário'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border bg-muted/40 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">Faça login para comentar</p>
          <Button asChild>
            <Link to="/login">Fazer login</Link>
          </Button>
        </div>
      )}

      {/* Lista */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando comentários...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Seja o primeiro a comentar.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 rounded-lg border bg-card p-4">
              <Avatar className="size-9">
                <AvatarImage src={resolveImageUrl(comment.author.avatar)} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{comment.author.name}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm">{comment.content}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => (isAuthenticated ? handleLike(comment) : toast.info('Faça login para curtir.'))}
                    className={cn(
                      'flex items-center gap-1 text-xs transition-colors hover:text-foreground',
                      comment.liked ? 'text-primary' : 'text-muted-foreground',
                    )}
                    aria-label="Curtir comentário"
                  >
                    <Heart className={cn('size-3.5', comment.liked && 'fill-current')} />
                    {comment.likesCount}
                  </button>
                  {user?.id === comment.author.id && (
                    <button
                      onClick={() => handleDelete(comment)}
                      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Excluir comentário"
                    >
                      <Trash2 className="size-3.5" /> Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
