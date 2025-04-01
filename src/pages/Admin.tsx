
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeft, BarChart2, Users, Activity, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: Date;
  mindMapsCount: number;
};

type MindMapStats = {
  totalMindMaps: number;
  totalUsers: number;
  activeUsers: number;
  averageMindMapsPerUser: number;
};

const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<MindMapStats>({
    totalMindMaps: 0,
    totalUsers: 0,
    activeUsers: 0,
    averageMindMapsPerUser: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated and has admin role
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");
    
    if (isAuthenticated !== "true" || userRole !== "admin") {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Load mock user data
    const loadMockData = () => {
      const mockUsers: UserData[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          status: "active",
          createdAt: new Date(2023, 1, 15),
          mindMapsCount: 12,
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          status: "active",
          createdAt: new Date(2023, 3, 22),
          mindMapsCount: 8,
        },
        {
          id: "3",
          name: "Robert Johnson",
          email: "robert@example.com",
          role: "user",
          status: "inactive",
          createdAt: new Date(2023, 5, 10),
          mindMapsCount: 3,
        },
        {
          id: "4",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          status: "active",
          createdAt: new Date(2022, 9, 5),
          mindMapsCount: 25,
        },
        {
          id: "5",
          name: "Sarah Williams",
          email: "sarah@example.com",
          role: "user",
          status: "active",
          createdAt: new Date(2023, 7, 18),
          mindMapsCount: 15,
        },
      ];
      
      setUsers(mockUsers);
      
      // Calculate stats
      const activeUsers = mockUsers.filter(user => user.status === "active").length;
      const totalMindMaps = mockUsers.reduce((sum, user) => sum + user.mindMapsCount, 0);
      
      setStats({
        totalMindMaps,
        totalUsers: mockUsers.length,
        activeUsers,
        averageMindMapsPerUser: totalMindMaps / mockUsers.length,
      });
      
      setIsLoading(false);
    };
    
    // Simulate API call
    setTimeout(loadMockData, 1000);
  }, [navigate, toast]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );
    
    const targetUser = users.find(user => user.id === userId);
    if (targetUser) {
      const newStatus = targetUser.status === "active" ? "inactive" : "active";
      toast({
        title: `User ${newStatus}`,
        description: `${targetUser.name} is now ${newStatus}.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Admin Panel</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="users">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart2 className="mr-2 h-4 w-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium">User Management</h2>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded border p-4">
                    <div className="h-6 w-1/4 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-gray-50 p-4 font-medium">
                  <div>Name</div>
                  <div className="col-span-2">Email</div>
                  <div>Role</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-6 items-center border-t p-4"
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="col-span-2">{user.email}</div>
                    <div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id)}
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <h2 className="mb-4 text-lg font-medium">Analytics</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse rounded-lg border p-4">
                    <div className="h-6 w-1/2 rounded bg-gray-200" />
                    <div className="mt-4 h-10 w-1/3 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Mind Maps
                    </CardTitle>
                    <BarChart2 className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMindMaps}</div>
                    <p className="text-xs text-gray-500">
                      +{Math.floor(Math.random() * 20)}% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-gray-500">
                      +{Math.floor(Math.random() * 15)}% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                    <User className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeUsers}</div>
                    <p className="text-xs text-gray-500">
                      {Math.floor(
                        (stats.activeUsers / stats.totalUsers) * 100
                      )}% of total users
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg. Mind Maps Per User
                    </CardTitle>
                    <Activity className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.averageMindMapsPerUser.toFixed(1)}
                    </div>
                    <p className="text-xs text-gray-500">
                      +{Math.floor(Math.random() * 10)}% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Mind Map Usage</CardTitle>
                <CardDescription>
                  Visual representation of mind map creation over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 rounded-md border border-dashed p-6 flex items-center justify-center">
                  <p className="text-gray-500">Charts would be rendered here in a real application</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <h2 className="mb-4 text-lg font-medium">System Settings</h2>
            <div className="rounded-lg border p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Maintenance Mode</h3>
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-10 cursor-pointer rounded-full bg-gray-200 px-1" />
                    <span className="text-sm text-gray-500">Off</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="mb-2 text-sm font-medium">Data Backup</h3>
                  <Button variant="outline" size="sm">
                    Download Backup
                  </Button>
                </div>
                
                <div className="pt-4">
                  <h3 className="mb-2 text-sm font-medium">System Cache</h3>
                  <Button variant="outline" size="sm">
                    Clear Cache
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
