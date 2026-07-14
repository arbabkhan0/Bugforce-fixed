import { describe, expect, it } from 'vitest';
import { projectSchema, taskSchema } from '../src/validators/schemas.js';

describe('request validation', () => {
  it('accepts a valid project key', () => {
    expect(projectSchema.parse({ name: 'Web app', key: 'WEB' }).key).toBe('WEB');
  });

  it('rejects unsupported task states', () => {
    expect(() => taskSchema.parse({ title: 'Ship it', status: 'blocked' })).toThrow();
  });

  it('strips fields that are not part of the task update contract', () => {
    const parsed = taskSchema.partial().parse({
      status: 'in_progress',
      project: 'someone-elses-project-id',
      createdBy: 'someone-elses-user-id',
    });
    expect(parsed).toEqual({ status: 'in_progress' });
    expect(parsed).not.toHaveProperty('project');
    expect(parsed).not.toHaveProperty('createdBy');
  });
});
