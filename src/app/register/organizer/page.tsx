
import OrganizerRegistrationForm from '../components/OrganizerRegistrationForm';

export default function OrganizerRegistrationPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 selection:bg-primary/20 bg-background">
            <div className="py-10 w-full">
              <OrganizerRegistrationForm />
            </div>
        </main>
    )
}
