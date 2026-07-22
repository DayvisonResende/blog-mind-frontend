import { cn } from '@/lib/utils';

/** Badge de categoria (laranja/ambar, conforme o Figma). */
export function CategoryBadge({ category, className }: { category: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-category/15 px-2.5 py-0.5 text-xs font-medium text-category',
        className,
      )}
    >
      {category}
    </span>
  );
}
