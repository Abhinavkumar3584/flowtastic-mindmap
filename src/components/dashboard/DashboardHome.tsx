
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, LineChart } from "@/components/ui/chart";
import { BookOpen, User, FileText, Calendar } from "lucide-react";
import { getMindMapsByExamCategory, getAllMindMaps } from "@/utils/mindmapStorage";
import { EXAM_CATEGORIES } from "@/components/mindmap/types";

const DashboardHome = () => {
  const allMindMaps = getAllMindMaps();
  const categoryCounts: Record<string, number> = {};
  
  EXAM_CATEGORIES.forEach(category => {
    const mapsInCategory = getMindMapsByExamCategory(category);
    categoryCounts[category] = mapsInCategory.length;
  });

  // Find categories with most mind maps
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Summary Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Exam Categories</CardTitle>
            <BookOpen className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{EXAM_CATEGORIES.length}</div>
            <p className="text-xs text-muted-foreground">All available exam categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Mind Maps</CardTitle>
            <FileText className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allMindMaps.length}</div>
            <p className="text-xs text-muted-foreground">Created across all categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <User className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Active administrators</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground">Dashboard last refreshed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Category Distribution Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Mind Maps by Category</CardTitle>
            <CardDescription>Distribution of mind maps across exam categories</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart
              data={Object.entries(categoryCounts).map(([category, count]) => ({
                name: category.split(' ')[0], // Abbreviate category names
                value: count
              }))}
              index="name"
              categories={["value"]}
              colors={["blue"]}
              valueFormatter={(value) => `${value} maps`}
              className="h-full"
            />
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Categories with most mind maps</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              data={sortedCategories.map(([category, count]) => ({
                name: category.split(' ')[0], // Abbreviate for display
                value: count
              }))}
              index="name"
              categories={["value"]}
              colors={["indigo", "blue", "cyan", "teal", "green"]}
              valueFormatter={(value) => `${value} maps`}
              className="h-64"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
