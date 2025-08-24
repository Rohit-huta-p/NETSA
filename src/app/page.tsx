
import { redirect } from 'next/navigation';

export default function Home() {
  // The root page should redirect to the login page
  // The middleware will handle redirecting logged-in users to the dashboard
  redirect('/login');
}
