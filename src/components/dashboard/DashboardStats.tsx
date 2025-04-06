
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart";
import { EXAM_CATEGORIES } from "@/components/mindmap/types";
import { getMindMapsByExamCategory } from "@/utils/mindmapStorage";

// Sample data for charts
const generateChartData = () => {
  // Mind maps by category
  const categoryData = EXAM_CATEGORIES.map(category => {
    const maps = getMindMapsByExamCategory(category);
    return {
      name: category.split(' ')[0], // Abbreviate for display
      value: maps.length
    };
  }).filter(item => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 10);

  // Sample monthly data
  const monthlyData = [
    { month: "Jan", mindMaps: 5 },
    { month: "Feb", mindMaps: 8 },
    { month: "Mar", mindMaps: 12 },
    { month: "Apr", mindMaps: 10 },
    { month: "May", mindMaps: 15 },
    { month: "Jun", mindMaps: 18 },
    { month: "Jul", mindMaps: 20 },
    { month: "Aug", mindMaps: 22 },
    { month: "Sep", mindMaps: 25 },
    { month: "Oct", mindMaps: 28 },
    { month: "Nov", mindMaps: 30 },
    { month: "Dec", mindMaps: 35 }
  ];

  return { categoryData, monthlyData };
};

const DashboardStats = () => {
  const { categoryData, monthlyData } = generateChartData();

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Statistical data about mind maps and exams
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Mind Maps by Category */}
              <div className="p-4">
                <h3 className="mb-4 text-lg font-medium">Mind Maps by Category</h3>
                <div className="h-80">
                  <BarChart
                    data={categoryData}
                    index="name"
                    categories={["value"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value} maps`}
                    className="h-full"
                  />
                </div>
              </div>

              {/* Monthly Growth (Sample data) */}
              <div className="p-4">
                <h3 className="mb-4 text-lg font-medium">Monthly Growth</h3>
                <div className="h-80">
                  <LineChart
                    data={monthlyData}
                    index="month"
                    categories={["mindMaps"]}
                    colors={["green"]}
                    valueFormatter={(value) => `${value} maps`}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Detailed metrics by exam category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {EXAM_CATEGORIES.slice(0, 8).map((category) => {
                const maps = getMindMapsByExamCategory(category);
                return (
                  <Card key={category} className="overflow-hidden">
                    <CardHeader className="bg-muted/20 p-4">
                      <CardTitle className="text-sm">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">{maps.length}</div>
                      <p className="text-xs text-muted-foreground">
                        Mind Maps Created
                      </p>
                      <div className="mt-4 h-1 w-full bg-muted">
                        <div 
                          className="h-1 bg-primary" 
                          style={{ width: `${Math.min(maps.length * 10, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;
