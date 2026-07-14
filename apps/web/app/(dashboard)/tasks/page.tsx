'use client';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkeletonRow } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import type { Task, TaskStatus, Priority } from '@/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const statusLabel: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const priorityLabel: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export default function TasksPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['my-tasks'],
    queryFn: () =>
      api<{ assignedTasks: Task[] }>('/dashboard').then((d) => d.assignedTasks),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Your queue</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">My Tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tasks assigned to you across all projects.
        </p>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {isLoading ? (
          <Card className="divide-y divide-border">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonRow key={i} className="px-5 py-4" />
            ))}
          </Card>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-muted">
              <ClipboardList size={26} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">All clear!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your task list is empty. Enjoy the calm — or pick up a new task.
              </p>
            </div>
          </div>
        ) : (
          <Card className="overflow-hidden divide-y divide-border">
            {data.map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
              >
                {/* Status indicator dot */}
                <div
                  className={[
                    'h-2 w-2 flex-shrink-0 rounded-full',
                    task.status === 'done'
                      ? 'bg-green-500'
                      : task.status === 'in_progress'
                        ? 'bg-amber-500'
                        : task.status === 'todo'
                          ? 'bg-blue-500'
                          : 'bg-slate-400',
                  ].join(' ')}
                  aria-hidden="true"
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant={task.status as TaskStatus}>
                      {statusLabel[task.status]}
                    </Badge>
                    <Badge variant={task.priority as Priority}>
                      {priorityLabel[task.priority]}
                    </Badge>
                    {task.dueDate && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={11} />
                        Due {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Project key */}
                {task.project?.key && (
                  <span className="flex-shrink-0 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {task.project.key}
                  </span>
                )}
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
