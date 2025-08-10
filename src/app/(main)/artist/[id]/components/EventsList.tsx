
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EventsList() {
    const upcomingEvents: any[] = [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent>
                {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                        {/* Map over upcoming events here */}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                        <p>No upcoming events scheduled.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
