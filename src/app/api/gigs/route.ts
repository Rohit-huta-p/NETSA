
import { NextResponse } from 'next/server';
import { getGigs, addGig } from '@/lib/firebase/firestore';
import { GetGigsQuery } from '@/lib/types';

async function getAuthUser(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return null;
    const token = authHeader.split('Bearer ')[1];
    if (!token) return null;

    try {
        // THIS IS AN INSECURE METHOD and should be replaced with Firebase Admin SDK for production.
        // It's used here to unblock development without full server-side admin setup.
        // It decodes the JWT payload to get the UID without verifying the token's signature.
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return { uid: payload.uid };

    } catch (error) {
        console.error("Error decoding auth token:", error);
        return null;
    }
}


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


export async function POST(request: Request) {
    const user = await getAuthUser(request);
    if (!user || !user.uid) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const gigData = await request.json();
        
        // The addGig function in firestore.ts already checks for organizer role.
        const { success, id, error } = await addGig(user.uid, gigData);

        if (error) {
            // Forward the specific error message from addGig
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
