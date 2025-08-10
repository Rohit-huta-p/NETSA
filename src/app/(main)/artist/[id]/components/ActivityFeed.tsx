import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drama } from "lucide-react";

export function ActivityFeed() {
  const activities = [
    { title: "Urban Dance Workshop", date: "Nov 15, 2024", status: "Attended" },
    { title: "Corporate Event", date: "Oct 28, 2024", status: "Attended" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-muted p-3 rounded-lg">
                        <Drama className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-semibold">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.date} • {activity.status}</p>
                    </div>
                </div>
                <Badge variant="outline" className="font-medium">{activity.status}</Badge>
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
