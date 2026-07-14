import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create your workspace</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Start organising your team&apos;s best work.
        </p>
      </div>
      <AuthForm mode="register" />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
          href="/login"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
