import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FullScreenLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-[60vh] items-center justify-center', className)}>
      <Loader2 className="size-8 animate-spin text-primary" aria-label="Carregando" />
    </div>
  );
}
