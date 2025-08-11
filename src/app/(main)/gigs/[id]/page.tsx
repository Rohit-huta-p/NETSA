
import { notFound } from "next/navigation";
import { getGig_Admin } from "@/lib/server/actions";
import { GigDetailView } from "../components/GigDetailView";

export default async function GigDetailPage({ params }: { params: { id: string } }) {
    const { data: gig, error } = await getGig_Admin(params.id);

    if (error || !gig) {
        notFound();
    }

    return (
        <div className="bg-muted/40 font-body">
            <div className="container mx-auto py-12">
                <GigDetailView gig={gig} />
            </div>
        </div>
    );
}
