
import { EditProfileForm } from "./components/EditProfileForm";
import { ProfileCompletion } from "./components/ProfileCompletion";
import { getUserProfile_Admin } from "@/lib/server/actions";
import { authAdmin } from "@/lib/firebase/admin";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";


async function getUserId() {
    const token = cookies().get('user-token')?.value;
    if (!token) return null;
    try {
        const decodedToken = await authAdmin.verifyIdToken(token);
        return decodedToken.uid;
    } catch (e) {
        return null;
    }
}

export default async function EditProfilePage() {
    const userId = await getUserId();
    if (!userId) {
        notFound();
    }
    const { data: user, error } = await getUserProfile_Admin(userId);

    if (error || !user) {
        notFound();
    }
    
    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-1">
                    <ProfileCompletion user={user} />
                </div>
                <div className="md:col-span-3">
                   <EditProfileForm user={user} />
                </div>
            </div>
        </div>
    )
}
