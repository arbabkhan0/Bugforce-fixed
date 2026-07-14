import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to continue shipping great work.
        </p>
      </div>
      <AuthForm mode="login" />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to BugForge?{' '}
        <Link
          className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
          href="/register"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
