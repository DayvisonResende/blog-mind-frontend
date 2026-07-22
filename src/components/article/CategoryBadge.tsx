import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  /** 'muted' = chip escuro (cards) · 'solid' = laranja (detalhe) */
  variant?: 'muted' | 'solid';
  className?: string;
}

export function CategoryBadge({ category, variant = 'muted', className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium',
        variant === 'solid'
          ? 'bg-category text-category-foreground'
          : 'bg-secondary text-secondary-foreground',
        className,
      )}
    >
      {category}
    </span>
  );
}
