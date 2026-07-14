import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-muted text-muted-foreground',
        outline: 'border border-border text-foreground',
        destructive: 'bg-destructive/10 text-destructive',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        // Task status
        backlog: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        todo: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        in_progress: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        done: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        // Priority
        low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        medium: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        high: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        urgent: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
