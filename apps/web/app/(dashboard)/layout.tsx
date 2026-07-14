'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/contexts/auth-context';
import { SkeletonStatCard, SkeletonCard } from '@/components/ui/skeleton';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="min-h-screen bg-background md:pl-[240px]">
        {/* Fake sidebar skeleton */}
        <div className="fixed inset-y-0 left-0 hidden w-[240px] border-r border-border bg-card p-5 md:block">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="mb-1 flex items-center gap-3 rounded-md px-3 py-2.5">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
        {/* Fake header */}
        <div className="sticky top-0 flex h-14 items-center border-b border-border bg-card px-6">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        {/* Fake content */}
        <main className="mx-auto max-w-7xl p-6 lg:p-8">
          <div className="mb-8">
            <div className="h-4 w-32 animate-pulse rounded bg-muted mb-2" />
            <div className="h-8 w-56 animate-pulse rounded bg-muted mb-2" />
            <div className="h-4 w-72 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </main>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
