
'use client';
import { useSearchParams } from 'next/navigation';
import ArtistRegistrationForm from './ArtistRegistrationForm';

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('type') || 'artist';

  // For now, we only have the artist registration form.
  // We can add a recruiter form later.
  if (userType === 'artist') {
    return <ArtistRegistrationForm />;
  }

  return <ArtistRegistrationForm />;
}
