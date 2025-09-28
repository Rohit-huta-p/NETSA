
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
    console.log("Apply route hit");
    const user = await getAuthUser(request);
    if (!user || !user.uid) {
        console.error("Apply route error: Unauthorized. User token is invalid or missing.");
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const gigId = params.id;
    if (!gigId) {
        console.error("Apply route error: Gig ID is missing from the request URL.");
        return NextResponse.json({ message: 'Gig ID is required' }, { status: 400 });
    }

    try {
        const { data: artistProfile, error: profileError } = await getUserProfile_Admin(user.uid);
        if (profileError || !artistProfile) {
            console.error(`Apply route error: Could not fetch artist profile for UID ${user.uid}. Error: ${profileError}`);
            return NextResponse.json({ message: profileError || 'Artist profile not found.' }, { status: 404 });
        }

        if (artistProfile.role !== 'artist') {
            console.error(`Apply route error: User ${user.uid} is not an artist, role is ${artistProfile.role}.`);
            return NextResponse.json({ message: 'Only artists can apply for gigs.' }, { status: 403 });
        }

        const gigRef = dbAdmin.collection('gigs').doc(gigId);
        const applicationRef = gigRef.collection('applications').doc(user.uid);

        // First, check if the gig exists.
        const gigDoc = await gigRef.get();
        if (!gigDoc.exists) {
            console.error(`Apply route error: Gig with ID ${gigId} not found.`);
            return NextResponse.json({ message: "Gig not found." }, { status: 404 });
        }
        
        await dbAdmin.runTransaction(async (transaction) => {
            const applicationDoc = await transaction.get(applicationRef);
            if (applicationDoc.exists) {
                // Throw a custom error to be caught below
                throw new Error('ALREADY_APPLIED');
            }
            
            const applicationData = {
                artistId: user.uid,
                artistName: `${artistProfile.firstName} ${artistProfile.lastName}`,
                artistType: artistProfile.artistType,
                status: 'pending',
                appliedAt: FieldValue.serverTimestamp(),
                bio: artistProfile.bio || '',
                location: artistProfile.city ? `${artistProfile.city}, ${artistProfile.country}` : 'Not specified',
                skills: artistProfile.skills || [],
                styles: artistProfile.styles || [],
            };
            
            transaction.set(applicationRef, applicationData);
            transaction.update(gigRef, {
                currentApplications: FieldValue.increment(1)
            });
        });

        console.log(`Apply route success: Application submitted for user ${user.uid} to gig ${gigId}.`);
        return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });

    } catch (error: any) {
        if (error.message === 'ALREADY_APPLIED') {
            console.log(`Apply route info: User ${user.uid} has already applied to gig ${gigId}.`);
            return NextResponse.json({ message: 'You have already applied for this gig.' }, { status: 409 }); // 409 Conflict
        }
        console.error(`Apply route CRITICAL error for gig ${gigId} by user ${user.uid}:`, error);
        return NextResponse.json({ message: 'An internal server error occurred', error: error.message }, { status: 500 });
    }
}
