
// This file can be built out to show a more detailed list of reviews
// For now, it will just render the main profile page content.
import ArtistProfilePage from "../page";

export default function ArtistReviewsPage({ params }: { params: { id: string }}) {
    // In a real app, you might fetch review data here
    // and pass it to a dedicated Reviews tab component.
    return <ArtistProfilePage params={params} />;
}
