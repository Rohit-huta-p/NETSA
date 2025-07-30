
'use client';
import { useSearchParams } from 'next/navigation';
import ArtistRegistrationForm from './ArtistRegistrationForm';
import RecruiterRegistrationForm from './RecruiterRegistrationForm';

export default function RegistrationForm() {
  const searchParams = useSearchParams();
  const userType = searchParams.get('type');

  if (userType === 'recruiter') {
    return <RecruiterRegistrationForm />;
  }
  
  return <ArtistRegistrationForm />;
}
