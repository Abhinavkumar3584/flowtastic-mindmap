
import { ChartContainer } from "@/components/ui/chart";
import { PieChart } from "recharts";
import { Cell, Label, Pie } from "recharts";

export function ExamCategoryDistribution() {
  // Mock data for the chart
  const data = [
    { name: "SSC EXAMS", value: 35 },
    { name: "BANKING", value: 25 },
    { name: "CIVIL SERVICES", value: 20 },
    { name: "RAILWAY", value: 10 },
    { name: "OTHER", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const config = {
    primaryColor: { light: "#0088FE", dark: "#0088FE" },
    secondaryColor: { light: "#00C49F", dark: "#00C49F" },
    tertiaryColor: { light: "#FFBB28", dark: "#FFBB28" },
    quaternaryColor: { light: "#FF8042", dark: "#FF8042" },
    quinaryColor: { light: "#8884d8", dark: "#8884d8" },
  };

  return (
    <ChartContainer config={config} className="h-full">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Label
            position="center"
            className="text-sm"
            value="Total: 100"
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
