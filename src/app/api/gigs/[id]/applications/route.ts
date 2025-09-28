
import { NextResponse, type NextRequest } from 'next/server';
import { dbAdmin, authAdmin } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { Application } from '@/lib/types';

async function getAuthUser(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split('Bearer ')[1];
    try {
        return await authAdmin.verifyIdToken(token);
    } catch (error) {
        console.error("API Applications Error: Error verifying auth token:", error);
        return null;
    }
}

// Helper function to convert Firestore Timestamps to serializable dates
const convertTimestamps = (data: any): any => {
    if (!data) return data;
    const newData: { [key: string]: any } = {};
    for (const key in data) {
        if (data[key] instanceof FieldValue || data[key] instanceof Date) {
             newData[key] = (data[key] as any).toDate().toISOString();
        } else if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
            newData[key] = convertTimestamps(data[key]);
        } else {
            newData[key] = data[key];
        }
    }
    return newData;
};


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(request);
    const gigId = params.id;

    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!gigId) {
        return NextResponse.json({ message: 'Gig ID is required' }, { status: 400 });
    }

    try {
        const gigRef = dbAdmin.collection('gigs').doc(gigId);
        const gigDoc = await gigRef.get();

        if (!gigDoc.exists) {
            return NextResponse.json({ message: 'Gig not found' }, { status: 404 });
        }

        const gigData = gigDoc.data();
        if (gigData?.organizerId !== user.uid) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const applicationsSnapshot = await gigRef.collection('applications').orderBy('appliedAt', 'desc').get();
        
        const applications: Application[] = applicationsSnapshot.docs.map(doc => {
            const data = doc.data();
            // Firestore Timestamps need to be converted to a serializable format
            const appliedAt = (data.appliedAt as FirebaseFirestore.Timestamp).toDate();
            return {
                artistId: doc.id,
                ...data,
                appliedAt,
            } as Application;
        });

        return NextResponse.json({ applications });

    } catch (error: any) {
        console.error(`Error fetching applications for gig ${gigId}:`, error);
        return NextResponse.json({ message: 'An internal server error occurred', error: error.message }, { status: 500 });
    }
}
