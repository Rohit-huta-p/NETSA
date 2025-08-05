
// This file can be built out to show a more detailed list of events
// For now, it will just render the main profile page content.
import ArtistProfilePage from "../page";

export default function ArtistEventsPage({ params }: { params: { id: string }}) {
    // In a real app, you might fetch specific event data here
    // and pass it to a dedicated Events tab component.
    return <ArtistProfilePage params={params} />;
}
