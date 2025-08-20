import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/store/userStore";
import { Check, X, Globe, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProfessionalInfoCardProps {
    artist: UserProfile;
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <div className="text-muted-foreground mt-1">{icon}</div>
        <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="text-sm font-semibold">{value}</div>
        </div>
    </div>
);

const BooleanDisplay = ({ value, text }: { value: boolean | undefined, text: string }) => (
     <div className="flex items-center gap-2">
        {value ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
        <span className="text-sm font-medium">{text}</span>
    </div>
);

export function ProfessionalInfoCard({ artist }: ProfessionalInfoCardProps) {
    if (artist.role !== 'artist') return null;
    
    const rate = artist.hourlyRate ? `${artist.hourlyRate} ${artist.currency || 'USD'}` : "Not specified";
    const cities = artist.preferredCities && artist.preferredCities.length > 0 ? artist.preferredCities.join(', ') : 'Not specified';
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <BooleanDisplay value={artist.availableForBooking} text="Available for Booking" />
                    <BooleanDisplay value={artist.agencyAffiliated} text="Agency Affiliated" />
                    <BooleanDisplay value={artist.travelReady} text="Willing to Travel" />
                    <BooleanDisplay value={artist.remoteWorkOk} text="Open to Remote" />
                 </div>

                <div className="space-y-3 pt-2">
                    <InfoItem icon={<Globe className="w-4 h-4"/>} label="Hourly Rate" value={rate} />
                    <InfoItem icon={<Globe className="w-4 h-4"/>} label="Preferred Cities" value={cities} />
                </div>
                
                 <div className="space-y-3 pt-2">
                    {artist.portfolioLinks && (
                         <Link href={artist.portfolioLinks} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-semibold">View Portfolio</span>
                        </Link>
                    )}
                     {artist.resumeUrl && (
                        <Link href={artist.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm font-semibold">View Resume/CV</span>
                        </Link>
                    )}
                 </div>

            </CardContent>
        </Card>
    )
}
