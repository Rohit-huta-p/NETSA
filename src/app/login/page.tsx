
import Link from 'next/link';
import LoginForm from './components/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 selection:bg-primary/20 bg-background">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-6 text-center">
            <p className="font-body text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary font-bold hover:underline">
                    Register
                </Link>
            </p>
        </div>
      </div>
    </main>
  );
}
