import RegistrationForm from '@/app/register/components/RegistrationForm';
import { Suspense } from 'react';

function RegisterContent() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 selection:bg-primary/20 bg-background">
      <RegistrationForm />
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}
