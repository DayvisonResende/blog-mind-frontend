import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('font-mono text-xl font-bold tracking-tight', className)}>
      &lt;M/&gt;
    </Link>
  );
}
