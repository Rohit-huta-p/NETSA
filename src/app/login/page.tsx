import Link from 'next/link';
import LoginForm from './components/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 bg-muted/40">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                    Register
                </Link>
            </p>
        </div>
      </div>
    </main>
  );
}
