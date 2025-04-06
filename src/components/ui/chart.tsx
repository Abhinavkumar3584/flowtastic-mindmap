
import { Card } from "@/components/ui/card";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { cn } from "@/lib/utils";

interface ChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

// Simple implementation of charts using Nivo
// In a real app, you'd want to add more configuration options
export function BarChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "red", "orange", "purple"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) {
  // Fallback renderer when we don't have Nivo
  const fallbackRenderer = () => (
    <div className="flex h-full items-center justify-center text-sm text-gray-500">
      {data.map((item, i) => (
        <div key={i} className="mr-4">
          <div className="font-medium">{item[index]}</div>
          <div>{valueFormatter(item[categories[0]])}</div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className={cn("h-80", className)}>
      {fallbackRenderer()}
    </div>
  );
}

export function PieChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "red", "orange", "purple"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) {
  // Fallback renderer when we don't have Nivo
  const fallbackRenderer = () => (
    <div className="flex h-full items-center justify-center text-sm text-gray-500">
      {data.map((item, i) => (
        <div key={i} className="mr-4">
          <div className="font-medium">{item[index]}</div>
          <div>{valueFormatter(item[categories[0]])}</div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className={cn("h-80", className)}>
      {fallbackRenderer()}
    </div>
  );
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["blue", "green", "red", "orange", "purple"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) {
  // Fallback renderer when we don't have Nivo
  const fallbackRenderer = () => (
    <div className="flex h-full items-center justify-center text-sm text-gray-500">
      {data.map((item, i) => (
        <div key={i} className="mr-4">
          <div className="font-medium">{item[index]}</div>
          <div>{valueFormatter(item[categories[0]])}</div>
        </div>
      ))}
    </div>
  );
  
  return (
    <div className={cn("h-80", className)}>
      {fallbackRenderer()}
    </div>
  );
}
