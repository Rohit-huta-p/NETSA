
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityFeed() {
  const activities = [
    { text: "Applied for 'The Grand Gala'", time: "2 hours ago" },
    { text: "Updated their portfolio with new videos.", time: "1 day ago" },
    { text: "Completed 'Advanced Vocal Training' workshop.", time: "3 days ago" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex flex-col">
              <span>{activity.text}</span>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
