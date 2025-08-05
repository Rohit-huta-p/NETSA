// /src/app/api/users/[userId]/route.ts
import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// GET a user profile
export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {
        const docRef = doc(db, 'users', params.userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return NextResponse.json({ data: docSnap.data() });
        } else {
            return NextResponse.json({ error: 'No such document!' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT (update) a user profile
export async function PUT(request: Request, { params }: { params: { userId: string } }) {
    try {
        const body = await request.json();
        const userRef = doc(db, 'users', params.userId);
        
        // Ensure the document exists before updating
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await updateDoc(userRef, {
            ...body,
            updatedAt: new Date(),
        });

        const updatedDoc = await getDoc(userRef);

        return NextResponse.json({ data: updatedDoc.data() });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
