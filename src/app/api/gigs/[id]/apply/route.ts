
import { NextResponse, type NextRequest } from 'next/server';
import { dbAdmin, authAdmin } from '@/lib/firebase/admin';
import { getUserProfile_Admin } from '@/lib/server/actions';
import { FieldValue } from 'firebase-admin/firestore';


async function getAuthUser(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("API Apply Error: Missing or invalid Authorization header.");
        return null;
    }
    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("API Apply Error: Error verifying auth token:", error);
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
        return NextResponse.json({ message: profileError || 'Artist profile not found.' }, { status: 404 });
    }

    if (artistProfile.role !== 'artist') {
        return NextResponse.json({ message: 'Only artists can apply for gigs.' }, { status: 403 });
    }

    try {
        const gigRef = dbAdmin.collection('gigs').doc(gigId);
        const applicationRef = gigRef.collection('applications').doc(user.uid);

        await dbAdmin.runTransaction(async (transaction) => {
            const gigDoc = await transaction.get(gigRef);
            if (!gigDoc.exists) {
                throw new Error("Gig not found.");
            }

            const applicationDoc = await transaction.get(applicationRef);
            if (applicationDoc.exists) {
                // By throwing an error, we abort the transaction and can send a specific status code.
                // We'll create a custom error type to be specific.
                const error = new Error('You have already applied for this gig.');
                (error as any).code = 'ALREADY_APPLIED';
                throw error;
            }

            const applicationData = {
                artistId: user.uid,
                artistName: `${artistProfile.firstName} ${artistProfile.lastName}`,
                artistType: artistProfile.artistType,
                status: 'pending',
                appliedAt: FieldValue.serverTimestamp(),
            };

            transaction.set(applicationRef, applicationData);
            transaction.update(gigRef, {
                currentApplications: FieldValue.increment(1)
            });
        });

        return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });

    } catch (error: any) {
        console.error(`Error submitting application for gig ${gigId} by user ${user.uid}:`, error);
        
        if (error.code === 'ALREADY_APPLIED') {
             return NextResponse.json({ message: error.message }, { status: 409 });
        }
        
        if (error.message === "Gig not found.") {
            return NextResponse.json({ message: "Gig not found." }, { status: 404 });
        }
        
        return NextResponse.json({ message: 'An internal server error occurred', error: error.message }, { status: 500 });
    }
}
