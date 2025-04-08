
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamCategoryDistribution } from "@/components/dashboard/ExamCategoryDistribution";
import { ExamProgressChart } from "@/components/dashboard/ExamProgressChart";
import { MindMapComplexityChart } from "@/components/dashboard/MindMapComplexityChart";
import { ExamCategoryTable } from "@/components/dashboard/ExamCategoryTable";
import { ExamCategory, EXAM_CATEGORIES } from "@/components/mindmap/types";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryStat {
  category: ExamCategory;
  count: number;
  averageNodes: number;
  averageConnections: number;
}

const DashboardStats = () => {
  const [timeRange, setTimeRange] = useState("30");
  
  // Mock data for category stats
  const categoryStats: CategoryStat[] = EXAM_CATEGORIES.map((category) => ({
    category,
    count: Math.floor(Math.random() * 10) + 1,
    averageNodes: Math.floor(Math.random() * 20) + 10,
    averageConnections: Math.floor(Math.random() * 15) + 5,
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Statistics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Mind Maps by Category</CardTitle>
            <CardDescription>Distribution of mind maps across exam categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ExamCategoryDistribution />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Mind Map Creation Trend</CardTitle>
            <CardDescription>Number of mind maps created over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ExamProgressChart timeRange={Number(timeRange)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Mind Map Complexity</CardTitle>
            <CardDescription>Average number of nodes and connections by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <MindMapComplexityChart data={categoryStats} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Exam Categories</CardTitle>
            <CardDescription>Exam categories with the most mind maps</CardDescription>
          </CardHeader>
          <CardContent>
            <ExamCategoryTable data={categoryStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
