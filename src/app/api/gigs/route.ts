
import { NextResponse, type NextRequest } from 'next/server';
import { getGigs, addGig } from '@/lib/firebase/firestore';
import { GetGigsQuery } from '@/lib/types';
import { authAdmin } from '@/lib/firebase/admin';

async function getAuthUser(request: NextRequest) {
    console.log("api/gigs/route.ts: getAuthUser called.");
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
        console.error("api/gigs/route.ts: Authorization header is missing.");
        return null;
    }
    if(!authHeader.startsWith('Bearer ')) {
        console.error("api/gigs/route.ts: Authorization header is not Bearer type.");
        return null;
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
        console.error("api/gigs/route.ts: Token is missing from Authorization header.");
        return null;
    }

    try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        console.log("api/gigs/route.ts: Token verified successfully for UID:", decodedToken.uid);
        return decodedToken;
    } catch (error) {
        console.error("api/gigs/route.ts: Error verifying auth token:", error);
        return null;
    }
}

export async function GET(request: NextRequest) {
  console.log("api/gigs/route.ts: GET handler initiated.");
  const user = await getAuthUser(request);
   if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

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
      console.error("api/gigs/route.ts: Error from getGigs function:", error);
      return NextResponse.json({ message: 'Error fetching gigs', error }, { status: 500 });
    }

    console.log("api/gigs/route.ts: GET request successful.");
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("api/gigs/route.ts: Unexpected error in GET handler:", err);
    return NextResponse.json({ message: 'An unexpected error occurred', error: err.message }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
    console.log("api/gigs/route.ts: POST handler initiated.");
    const user = await getAuthUser(request);

    if (!user || !user.uid) {
        console.error("api/gigs/route.ts: POST handler failed - Unauthorized user.");
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const gigData = await request.json();
        console.log("api/gigs/route.ts: Gig data received for user:", user.uid);
        
        const { success, id, error } = await addGig(user.uid, gigData);

        if (error) {
            console.error("api/gigs/route.ts: addGig function returned an error:", error);
            return NextResponse.json({ message: error }, { status: 400 });
        }

        if (!success) {
            console.error("api/gigs/route.ts: addGig function returned success=false.");
            return NextResponse.json({ message: 'Failed to create gig due to a server error.' }, { status: 500 });
        }

        console.log("api/gigs/route.ts: Gig created successfully with ID:", id);
        return NextResponse.json({ message: 'Gig created successfully', gigId: id }, { status: 201 });

    } catch (err: any) {
         if (err instanceof SyntaxError) {
            console.error("api/gigs/route.ts: Invalid JSON in request body.");
            return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
        }
        console.error("api/gigs/route.ts: Unexpected error in POST handler:", err);
        return NextResponse.json({ message: 'An unexpected error occurred', error: err.message }, { status: 500 });
    }
}
