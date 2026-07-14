import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Decorative blurred blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'hsl(var(--primary))' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full opacity-10 blur-3xl"
        style={{ background: 'hsl(246 80% 80%)' }}
        aria-hidden="true"
      />

      <section className="relative w-full max-w-md animate-scale-in rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-card-lg backdrop-blur-xl dark:bg-white/[0.03]">
        {/* Inner card */}
        <div className="absolute inset-0 rounded-2xl bg-card/95 dark:bg-card/90" />
        <div className="relative z-10">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2.5 text-xl font-bold tracking-tight"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm text-sm font-bold">
              B
            </span>
            <span>BugForge</span>
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}
