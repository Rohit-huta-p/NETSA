
// This file can be built out to show a more detailed portfolio gallery
// For now, it will just render the main profile page content.
import ArtistProfilePage from "../page";

export default function ArtistPortfolioPage({ params }: { params: { id: string }}) {
    // In a real app, you might fetch portfolio data here
    // and pass it to a dedicated Portfolio tab component.
    return <ArtistProfilePage params={params} />;
}
