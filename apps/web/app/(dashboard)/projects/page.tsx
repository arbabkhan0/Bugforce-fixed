'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FolderOpen, Plus, AlertCircle, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { api } from '@/services/api';
import type { Project } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  key: z
    .string()
    .regex(/^[A-Za-z][A-Za-z0-9]{1,9}$/, 'Key must start with a letter, 2–10 alphanumeric chars'),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ProjectsPage() {
  const client = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api<Project[]>('/projects'),
  });

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const create = async (values: FormValues) => {
    const optimisticProject: Project = {
      _id: crypto.randomUUID(),
      ...values,
      description: values.description ?? '',
      updatedAt: new Date().toISOString(),
    };
    client.setQueryData<Project[]>(['projects'], (projects = []) => [
      optimisticProject,
      ...projects,
    ]);
    try {
      await api('/projects', { method: 'POST', body: JSON.stringify(values) });
      form.reset();
      await client.invalidateQueries({ queryKey: ['projects'] });
    } catch {
      form.setError('root', { message: 'Unable to create project. Please try again.' });
      await client.invalidateQueries({ queryKey: ['projects'] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Plan the work</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organise your work into projects and track progress.
        </p>
      </div>

      {/* Create form */}
      <Card className="p-5">
        <h2 className="mb-4 text-sm font-semibold">New project</h2>
        <form onSubmit={form.handleSubmit(create)} noValidate>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label htmlFor="proj-name" className="text-xs font-medium text-muted-foreground">
                Project name <span className="text-destructive">*</span>
              </label>
              <Input
                id="proj-name"
                placeholder="e.g. Website Redesign"
                aria-invalid={!!form.formState.errors.name}
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="proj-key" className="text-xs font-medium text-muted-foreground">
                Key <span className="text-destructive">*</span>
              </label>
              <Input
                id="proj-key"
                placeholder="e.g. WEB"
                className="uppercase"
                aria-invalid={!!form.formState.errors.key}
                {...form.register('key')}
              />
              {form.formState.errors.key && (
                <p className="text-xs text-destructive">{form.formState.errors.key.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="proj-desc" className="text-xs font-medium text-muted-foreground">
                Description
              </label>
              <Input
                id="proj-desc"
                placeholder="Optional short description"
                {...form.register('description')}
              />
            </div>

            <div className="flex flex-col justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting} className="gap-2">
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner className="text-primary-foreground" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create project
                  </>
                )}
              </Button>
            </div>
          </div>

          {form.formState.errors.root && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2" role="alert">
              <AlertCircle size={14} className="text-destructive" />
              <p className="text-xs text-destructive">{form.formState.errors.root.message}</p>
            </div>
          )}
        </form>
      </Card>

      {/* Project list */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-muted">
            <FolderOpen size={26} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">No projects yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first project using the form above.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.map((project) => (
            <Card
              key={project._id}
              className="group p-5 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex-shrink-0 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    {project.key}
                  </span>
                  <h2 className="truncate font-semibold">{project.name}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
              {project.updatedAt && (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  Updated {formatDate(project.updatedAt)}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
