
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: number;
  action: string;
  subject: string;
  examCategory: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 rounded-md border p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {activity.action.charAt(0)}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium">
                <span className="font-bold">{activity.action}</span>: {activity.subject}
              </p>
              <p className="text-xs text-muted-foreground">
                Category: {activity.examCategory}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground">No recent activity</p>
      )}
    </div>
  );
}
