
import { NextResponse, type NextRequest } from 'next/server';
import { getGigs, addGig } from '@/lib/firebase/firestore';
import { GetGigsQuery } from '@/lib/types';
import { authAdmin } from '@/lib/firebase/admin';

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


export async function POST(request: NextRequest) {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized: No user ID found in headers' }, { status: 401 });
    }

    try {
        const gigData = await request.json();
        
        const { success, id, error } = await addGig(userId, gigData);

        if (error) {
            return NextResponse.json({ message: 'An unexpected error occurred', error: error }, { status: 400 });
        }

        if (!success) {
            return NextResponse.json({ message: 'Failed to create gig' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Gig created successfully', gigId: id }, { status: 201 });

    } catch (err: any) {
         if (err instanceof SyntaxError) {
            return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
        }
        console.error("POST /api/gigs error:", err);
        return NextResponse.json({ message: 'An unexpected error occurred', error: err.message }, { status: 500 });
    }
}
