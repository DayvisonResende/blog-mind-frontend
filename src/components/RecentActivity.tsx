import { Link } from 'react-router-dom';
import type { ActivityItem } from '@/types/api';
import { useAsync } from '@/hooks/useAsync';
import { commentService } from '@/services/comment.service';
import { formatDate, resolveImageUrl } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RecentActivity() {
  const { data, loading } = useAsync<ActivityItem[]>(() => commentService.recentActivity(), []);

  return (
    <div className="rounded-lg border bg-card p-5">
      <h2 className="mb-4 text-lg font-bold">Atividade Recente</h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma atividade recente.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((item) => (
            <li key={item.id} className="flex gap-3">
              <Avatar className="size-8">
                <AvatarImage src={resolveImageUrl(item.commenter.avatar)} alt={item.commenter.name} />
                <AvatarFallback>{item.commenter.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 text-sm">
                <p>
                  <span className="font-medium">{item.commenter.name}</span>{' '}
                  <span className="text-muted-foreground">comentou em</span>{' '}
                  <Link to={`/artigos/${item.article.id}`} className="font-medium hover:underline">
                    {item.article.title}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
