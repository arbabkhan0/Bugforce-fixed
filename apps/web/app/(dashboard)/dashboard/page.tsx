'use client';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpRight,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  FolderOpen,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkeletonStatCard, SkeletonRow } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';
import type { Project, Task, TaskStatus, Priority } from '@/types';

type Dashboard = {
  statistics: { projects: number; assignedTasks: number; completedTasks: number };
  projects: Project[];
  assignedTasks: Task[];
  activity: Array<{ _id: string; action: string; createdAt: string; actor?: { name: string } }>;
};


export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api<Dashboard>('/dashboard'),
    staleTime: Infinity,
  });

  const stats = [
    {
      label: 'Active projects',
      value: data?.statistics.projects ?? 0,
      icon: FolderKanban,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'Assigned to you',
      value: data?.statistics.assignedTasks ?? 0,
      icon: ListTodo,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Completed work',
      value: data?.statistics.completedTasks ?? 0,
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Your workspace
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          {greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep every project and delivery moving forward.
        </p>
      </div>

      {/* Stats */}
      <section aria-label="Statistics" className="grid gap-4 sm:grid-cols-3">
        {isLoading
          ? [1, 2, 3].map((i) => <SkeletonStatCard key={i} />)
          : stats.map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} className="p-5 hover:shadow-card-hover transition-shadow">
                <div className={`mb-4 inline-flex rounded-lg p-2 ${bg}`}>
                  <Icon size={18} className={color} />
                </div>
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{label}</p>
              </Card>
            ))}
      </section>

      {/* Projects + Tasks */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Projects */}
        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">My projects</h2>
            <Link
              href="/projects"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4"
            >
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="p-3">
            {isLoading ? (
              [1, 2, 3].map((i) => <SkeletonRow key={i} />)
            ) : data?.projects.length ? (
              data.projects.map((project) => (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  className="group flex items-center justify-between rounded-md px-3 py-2.5 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {project.key}
                    </span>
                    <span className="truncate text-sm font-medium">{project.name}</span>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                  <FolderOpen size={22} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">No projects yet</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Create your first project to get started.
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-xs font-medium text-primary hover:underline underline-offset-4"
                >
                  Create a project →
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Assigned Tasks */}
        <Card>
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Assigned tasks</h2>
            <Link
              href="/tasks"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4"
            >
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="p-3">
            {isLoading ? (
              [1, 2, 3].map((i) => <SkeletonRow key={i} />)
            ) : data?.assignedTasks.length ? (
              data.assignedTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-start justify-between gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Badge variant={task.status as TaskStatus}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={task.priority as Priority}>{task.priority}</Badge>
                    </div>
                  </div>
                  {task.project?.key && (
                    <span className="flex-shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {task.project.key}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                  <ClipboardList size={22} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">All clear!</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Nothing assigned to you right now.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
