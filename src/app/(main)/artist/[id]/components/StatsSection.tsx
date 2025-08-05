
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsSection() {
    const stats = [
        { title: "Events Attended", value: "42" },
        { title: "Profile Views", value: "1.2k" },
        { title: "Connections", value: "158" },
        { title: "Total Earnings", value: "$25k" },
    ];
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map(stat => (
                <Card key={stat.title}>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
