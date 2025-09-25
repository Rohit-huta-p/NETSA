
import { NextResponse, type NextRequest } from 'next/server';
import { dbAdmin, authAdmin } from '@/lib/firebase/admin';
import { getUserProfile_Admin } from '@/lib/server/actions';
import { FieldValue } from 'firebase-admin/firestore';

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
        console.error("Error verifying auth token in /api/gigs/[id]/apply:", error);
        return null;
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const user = await getAuthUser(request);
    if (!user || !user.uid) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const gigId = params.id;
    if (!gigId) {
        return NextResponse.json({ message: 'Gig ID is required' }, { status: 400 });
    }

    const { data: artistProfile, error: profileError } = await getUserProfile_Admin(user.uid);
    if (profileError || !artistProfile) {
        return NextResponse.json({ message: 'Artist profile not found.' }, { status: 404 });
    }

    if (artistProfile.role !== 'artist') {
        return NextResponse.json({ message: 'Only artists can apply for gigs.' }, { status: 403 });
    }

    try {
        const gigRef = dbAdmin.collection('gigs').doc(gigId);
        const applicationRef = gigRef.collection('applications').doc(user.uid);

        const applicationDoc = await applicationRef.get();
        if (applicationDoc.exists) {
            return NextResponse.json({ message: 'You have already applied for this gig.' }, { status: 409 });
        }

        const applicationData = {
            artistId: user.uid,
            artistName: `${artistProfile.firstName} ${artistProfile.lastName}`,
            artistType: artistProfile.artistType,
            status: 'pending',
            appliedAt: FieldValue.serverTimestamp(),
        };

        await dbAdmin.runTransaction(async (transaction) => {
            transaction.set(applicationRef, applicationData);
            transaction.update(gigRef, {
                currentApplications: FieldValue.increment(1)
            });
        });

        return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });

    } catch (error: any) {
        console.error(`Error submitting application for gig ${gigId} by user ${user.uid}:`, error);
        return NextResponse.json({ message: 'An internal server error occurred', error: error.message }, { status: 500 });
    }
}
