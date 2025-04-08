
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface DashboardStatsCardProps {
  title: string;
  value: number | string;
  description: string;
  trend?: "up" | "down";
  trendValue?: number;
}

export function DashboardStatsCard({
  title,
  value,
  description,
  trend,
  trendValue,
}: DashboardStatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{title}</p>
          {trend && (
            <div
              className={`flex items-center text-xs ${
                trend === "up" ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend === "up" ? (
                <ArrowUpIcon className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3" />
              )}
              {trendValue}%
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
