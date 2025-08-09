
import { NextResponse } from 'next/server';
import { getGigs } from '@/lib/firebase/firestore';
import { GetGigsQuery } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query: GetGigsQuery = {
    page: searchParams.has('page') ? parseInt(searchParams.get('page')!, 10) : undefined,
    limit: searchParams.has('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined,
    category: searchParams.get('category') || undefined,
    artistType: searchParams.getAll('artistType') || undefined,
    location: searchParams.get('location') || undefined,
    compensation_min: searchParams.has('compensation_min') ? parseInt(searchParams.get('compensation_min')!, 10) : undefined,
    compensation_max: searchParams.has('compensation_max') ? parseInt(searchParams.get('compensation_max')!, 10) : undefined,
    experience_level: searchParams.get('experience_level') || undefined,
    is_remote: searchParams.has('is_remote') ? searchParams.get('is_remote') === 'true' : undefined,
    start_date_from: searchParams.get('start_date_from') || undefined,
    start_date_to: searchParams.get('start_date_to') || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') as GetGigsQuery['sort'] || undefined,
  };

  try {
    const { data, error } = await getGigs(query);

    if (error) {
      return NextResponse.json({ message: 'Error fetching gigs', error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ message: 'An unexpected error occurred', error: err.message }, { status: 500 });
  }
}

    