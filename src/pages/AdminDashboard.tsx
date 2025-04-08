
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ExamCategoryDistribution } from "@/components/dashboard/ExamCategoryDistribution";
import { EXAM_CATEGORIES } from "@/components/mindmap/types";

const AdminDashboard = () => {
  // Get mind map count from local storage
  const getMindMapCount = () => {
    try {
      const storedMindMaps = localStorage.getItem('mindMaps');
      if (!storedMindMaps) return 0;
      return Object.keys(JSON.parse(storedMindMaps)).length;
    } catch (error) {
      console.error("Error getting mind map count:", error);
      return 0;
    }
  };

  // Mock data for recent activity
  const recentActivities = [
    { 
      id: 1, 
      action: "Created mind map", 
      subject: "UPSC Civil Services", 
      examCategory: "CIVIL SERVICES EXAMS", 
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() 
    },
    { 
      id: 2, 
      action: "Updated mind map", 
      subject: "SSC CGL", 
      examCategory: "SSC EXAMS", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() 
    },
    { 
      id: 3, 
      action: "Deleted mind map", 
      subject: "IBPS PO", 
      examCategory: "BANKING EXAMS", 
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() 
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatsCard 
          title="Total Mind Maps" 
          value={getMindMapCount()} 
          description="Mind maps created" 
          trend="up" 
          trendValue={5.4}
        />
        <DashboardStatsCard 
          title="Exam Categories" 
          value={EXAM_CATEGORIES.length} 
          description="Available exam categories" 
        />
        <DashboardStatsCard 
          title="Unique Sub-Exams" 
          value={12} 
          description="Distinct sub-exams" 
          trend="up" 
          trendValue={2.1}
        />
        <DashboardStatsCard 
          title="Storage Used" 
          value="1.2 MB" 
          description="Local storage" 
          trend="up" 
          trendValue={12}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions performed in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activities={recentActivities} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Mind Maps by Category</CardTitle>
            <CardDescription>Distribution of mind maps across exam categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ExamCategoryDistribution />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
