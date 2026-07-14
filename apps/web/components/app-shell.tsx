'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  CheckSquare,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/auth-context';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';

const navigation = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'My Tasks', icon: CheckSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  return (
    <div
      className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

function SidebarContent({
  path,
  user,
  onSignOut,
}: {
  path: string;
  user: { name: string; email?: string } | null;
  onSignOut: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-8 flex items-center gap-2.5 px-3 text-lg font-bold tracking-tight"
      >
        <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-sm">
          B
        </span>
        <span>BugForge</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5" aria-label="Main navigation">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon size={17} className="flex-shrink-0" />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="mt-4 border-t border-border pt-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <UserAvatar name={user?.name ?? 'User'} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.name ?? 'Workspace member'}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-1 w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={onSignOut}
        >
          <LogOut size={16} />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const pollNotifications = () => {
      void api<Array<{ readAt?: string }>>('/notifications').then((notifications) =>
        setNotificationCount(notifications.filter((n) => !n.readAt).length),
      );
    };
    pollNotifications();
    const interval = setInterval(pollNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    signOut();
    router.push('/login');
  };

  const pageTitles: Record<string, string> = {
    '/dashboard': 'Overview',
    '/projects': 'Projects',
    '/tasks': 'My Tasks',
    '/settings': 'Settings',
  };
  const pageTitle =
    Object.entries(pageTitles).find(([href]) => path === href || path.startsWith(href + '/'))?.[1] ?? 'BugForge';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-[240px] border-r border-border bg-card p-5',
          'transition-transform duration-300 ease-in-out',
          'md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Sidebar"
      >
        <SidebarContent path={path} user={user} onSignOut={handleSignOut} />
      </aside>

      {/* Main */}
      <div className="md:pl-[240px]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-md md:px-6">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>

          {/* Page title */}
          <h1 className="flex-1 text-sm font-semibold tracking-tight">{pageTitle}</h1>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
              className="relative"
            >
              <Bell size={17} />
              {notificationCount > 0 && (
                <span
                  className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  aria-hidden="true"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </Button>

            {/* User avatar in header */}
            <div className="ml-1">
              <UserAvatar name={user?.name ?? 'U'} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-7xl p-5 md:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
