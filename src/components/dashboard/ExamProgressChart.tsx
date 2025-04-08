
import { ChartContainer } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

interface ExamProgressChartProps {
  timeRange: number;
}

export function ExamProgressChart({ timeRange }: ExamProgressChartProps) {
  // Generate mock data based on the time range
  const data = useMemo(() => {
    const result = [];
    const today = new Date();
    let dataPoints = timeRange;
    
    // Limit data points for better visualization
    if (dataPoints > 30) {
      dataPoints = 30;
    }

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i * (timeRange / dataPoints));
      
      result.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mindMaps: Math.floor(Math.random() * 5) + 1,
        cumulative: 0, // Will calculate below
      });
    }

    // Calculate cumulative values
    let cumulative = 0;
    for (const item of result) {
      cumulative += item.mindMaps;
      item.cumulative = cumulative;
    }

    return result;
  }, [timeRange]);

  const config = {
    mindMaps: { label: "Daily" },
    cumulative: { label: "Cumulative" },
  };

  return (
    <ChartContainer config={config} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="mindMaps"
            stroke="#8884d8"
            name="Daily Mind Maps"
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#82ca9d"
            name="Cumulative Mind Maps"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
