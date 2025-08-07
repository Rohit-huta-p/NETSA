import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin-config';

// GET a user profile using Admin SDK
export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {
        const docRef = adminDb.collection('users').doc(params.userId);
        console.log("docRef",docRef)
        const docSnap = await docRef.get();
        console.log("docSnap",docSnap)
        if (docSnap.exists) {
            return NextResponse.json({ data: docSnap.data() });
        } else {
            return NextResponse.json({ error: 'No such document!' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT (update) a user profile using Admin SDK
export async function PUT(request: Request, { params }: { params: { userId: string } }) {
    try {
        const body = await request.json();
        const userRef = adminDb.collection('users').doc(params.userId);
        
        const docSnap = await userRef.get();
        if (!docSnap.exists) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await userRef.update({
            ...body,
            updatedAt: new Date(),
        });

        const updatedDoc = await userRef.get();

        return NextResponse.json({ data: updatedDoc.data() });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
