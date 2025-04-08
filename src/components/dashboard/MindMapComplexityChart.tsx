
import { BarChart } from "recharts";
import { Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface CategoryStat {
  category: string;
  count: number;
  averageNodes: number;
  averageConnections: number;
}

interface MindMapComplexityChartProps {
  data: CategoryStat[];
}

export function MindMapComplexityChart({ data }: MindMapComplexityChartProps) {
  const chartData = data.map((item) => ({
    name: item.category.split(" ")[0], // Take just the first word for better display
    nodes: item.averageNodes,
    connections: item.averageConnections,
  }));

  const config = {
    nodes: { label: "Avg. Nodes" },
    connections: { label: "Avg. Connections" },
  };

  return (
    <ChartContainer config={config} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="nodes" fill="#8884d8" name="Average Nodes" />
          <Bar dataKey="connections" fill="#82ca9d" name="Average Connections" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
