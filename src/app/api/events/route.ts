

import { NextResponse, type NextRequest } from 'next/server';
import { addEvent } from '@/lib/server/actions';
import { authAdmin } from '@/lib/firebase/admin';

async function getAuthUser(request: NextRequest) {
    console.log("api/events/route.ts: getAuthUser called");
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("api/events/route.ts: No Authorization header or incorrect format.");
        return null;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        console.log("api/events/route.ts: Token verified successfully for UID:", decodedToken.uid);
        return decodedToken;
    } catch (error) {
        console.error("api/events/route.ts: Error verifying auth token:", error);
        return null;
    }
}

export async function POST(request: NextRequest) {
    console.log("api/events/route.ts: POST handler initiated.");
    const user = await getAuthUser(request);

    if (!user || !user.uid) {
        console.error("api/events/route.ts: POST handler failed - Unauthorized user.");
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const eventData = await request.json();
        console.log("api/events/route.ts: Event data received for user:", user.uid, eventData);
        
        const { success, id, error } = await addEvent(user.uid, eventData);

        if (error) {
            console.error("api/events/route.ts: addEvent function returned an error:", error.message);
            return NextResponse.json({ message: error.message || 'An unknown error occurred during event creation.' }, { status: 400 });
        }

        if (!success) {
            console.error("api/events/route.ts: addEvent function returned success=false.");
            return NextResponse.json({ message: 'Failed to create event due to a server error.' }, { status: 500 });
        }

        console.log("api/events/route.ts: Event created successfully with ID:", id);
        return NextResponse.json({ message: 'Event created successfully', eventId: id }, { status: 201 });

    } catch (err: any) {
         if (err instanceof SyntaxError) {
            console.error("api/events/route.ts: Invalid JSON in request body.");
            return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
        }
        console.error("api/events/route.ts: Unexpected error in POST handler:", err);
        return NextResponse.json({ message: 'An unexpected error occurred', error: err.message }, { status: 500 });
    }
}
