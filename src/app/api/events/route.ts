

import { NextResponse, type NextRequest } from 'next/server';
import { addEvent } from '@/lib/server/actions';
import { authAdmin } from '@/lib/firebase/admin';

async function getAuthUser(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("api/events/route.ts: Error verifying auth token:", error);
        return null;
    }
}

export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);

    if (!user || !user.uid) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const eventData = await request.json();
        
        const { success, id, error } = await addEvent(user.uid, eventData);

        if (error) {
            return NextResponse.json({ message: error.message || 'An unknown error occurred during event creation.' }, { status: 400 });
        }

        if (!success) {
            return NextResponse.json({ message: 'Failed to create event due to a server error.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Event created successfully', eventId: id }, { status: 201 });

    } catch (err: any) {
         if (err instanceof SyntaxError) {
            return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
        }
        return NextResponse.json({ message: 'An unexpected error occurred', error: err.message }, { status: 500 });
    }
}
