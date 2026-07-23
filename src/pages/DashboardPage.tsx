import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Heart,
  MessageSquare,
  Pencil,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Article, DashboardStats } from '@/types/api';
import { articleService } from '@/services/article.service';
import type { NormalizedError } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatDate, resolveImageUrl } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { RecentActivity } from '@/components/RecentActivity';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface StatCard {
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
  suffix?: string;
}

const statCards: StatCard[] = [
  { key: 'totalArticles', label: 'Total de Artigos', icon: FileText },
  { key: 'totalComments', label: 'Engajamento', icon: MessageSquare },
  { key: 'totalLikes', label: 'Curtidas', icon: Heart },
  { key: 'avgReadingTime', label: 'Tempo médio de leitura', icon: TrendingUp, suffix: ' min' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle('Dashboard');

  const [stats, setStats] = useState<DashboardStats>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([articleService.stats(), articleService.mine()])
      .then(([s, a]) => {
        setStats(s);
        setArticles(a);
      })
      .catch((e) => toast.error((e as NormalizedError).message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await articleService.remove(toDelete.id);
      toast.success('Artigo excluído.');
      setToDelete(null);
      load();
    } catch (e) {
      toast.error((e as NormalizedError).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta, {user?.name}!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/configuracoes">
              <Settings className="mr-2 size-4" /> Configurações
            </Link>
          </Button>
          <Button asChild>
            <Link to="/artigos/novo">
              <Plus className="mr-2 size-4" /> Novo Artigo
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, suffix }) => (
          <div key={key} className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm">{label}</span>
              <Icon className="size-4" />
            </div>
            {loading || !stats ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <p className="mt-2 text-3xl font-bold">
                {stats[key]}
                {suffix ?? ''}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold">Meus Artigos</h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            title="Você ainda não escreveu nenhum artigo"
            description="Compartilhe seu primeiro artigo com a comunidade."
            action={
              <Button asChild>
                <Link to="/artigos/novo">Criar Artigo</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center"
              >
                <div className="hidden size-16 shrink-0 overflow-hidden rounded-md bg-muted sm:block">
                  {resolveImageUrl(article.coverImage) && (
                    <img
                      src={resolveImageUrl(article.coverImage)}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/artigos/${article.id}`} className="font-semibold hover:underline">
                    {article.title}
                  </Link>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{article.summary}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(article.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="size-3" /> {article.commentsCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="size-3" /> {article.likesCount}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => navigate(`/artigos/${article.id}/editar`)}
                  >
                    <Pencil className="mr-1 size-3.5" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-destructive hover:text-destructive"
                    onClick={() => setToDelete(article)}
                  >
                    <Trash2 className="mr-1 size-3.5" /> Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        <RecentActivity />
      </div>

      <Dialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Artigo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este artigo? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
