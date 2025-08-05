
'use client';
import { useSearchParams } from 'next/navigation';
import ArtistRegistrationForm from './ArtistRegistrationForm';
import OrganizerRegistrationForm from './OrganizerRegistrationForm';

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('type');

  if (userType === 'organizer') {
    return <OrganizerRegistrationForm />;
  }
  
  return <ArtistRegistrationForm />;
}
