import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'transition-shadow duration-200',
        'outline-none',
        'focus:border-primary/60 focus:ring-2 focus:ring-ring/30 focus:ring-offset-0',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30',
        className,
      )}
      {...props}
    />
  );
}
