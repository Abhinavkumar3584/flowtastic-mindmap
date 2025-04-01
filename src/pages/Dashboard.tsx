
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, FileEdit, LogOut, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type MindMap = {
  id: string;
  name: string;
  lastModified: Date;
  createdAt: Date;
  thumbnailUrl?: string;
};

const Dashboard = () => {
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMindMapName, setNewMindMapName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = localStorage.getItem("userRole") || "user";
  const userEmail = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/login");
      return;
    }
    
    // Load mind maps from localStorage
    const loadMindMaps = () => {
      try {
        const mindmapsData = localStorage.getItem("mindmaps");
        if (mindmapsData) {
          const mindmaps = JSON.parse(mindmapsData);
          const mindMapArray: MindMap[] = Object.entries(mindmaps).map(([name, _]) => ({
            id: Math.random().toString(36).substring(2, 9),
            name,
            lastModified: new Date(),
            createdAt: new Date(Date.now() - Math.random() * 10000000000),
          }));
          setMindMaps(mindMapArray);
        }
      } catch (error) {
        console.error("Error loading mind maps:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMindMaps();
  }, [navigate]);

  const handleCreateMindMap = () => {
    if (!newMindMapName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a mind map name",
        variant: "destructive",
      });
      return;
    }
    
    // Create a new mind map entry
    const newMindMap: MindMap = {
      id: Math.random().toString(36).substring(2, 9),
      name: newMindMapName,
      lastModified: new Date(),
      createdAt: new Date(),
    };
    
    setMindMaps([...mindMaps, newMindMap]);
    setNewMindMapName("");
    setIsDialogOpen(false);
    
    toast({
      title: "Mind map created",
      description: `"${newMindMapName}" has been created.`,
    });
  };

  const handleDeleteMindMap = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setMindMaps(mindMaps.filter(map => map.id !== id));
      
      toast({
        title: "Mind map deleted",
        description: `"${name}" has been deleted.`,
      });
    }
  };

  const handleEditMindMap = (name: string) => {
    navigate(`/?name=${name}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Mind Map Dashboard</h1>
          <div className="flex items-center gap-3">
            {userRole === "admin" && (
              <Button variant="outline" size="sm" onClick={handleAdminPanel}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin Panel
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Welcome, {userEmail}</h2>
            <p className="text-sm text-gray-500">Manage your mind maps</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Mind Map
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Mind Map</DialogTitle>
                <DialogDescription>
                  Enter a name for your new mind map.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={newMindMapName}
                onChange={(e) => setNewMindMapName(e.target.value)}
                placeholder="My Mind Map"
                className="my-4"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMindMap}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-16 bg-gray-200" />
                <CardContent className="h-24 bg-gray-100" />
                <CardFooter className="h-12 bg-gray-200" />
              </Card>
            ))}
          </div>
        ) : mindMaps.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mindMaps.map((mindMap) => (
              <Card key={mindMap.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{mindMap.name}</CardTitle>
                  <CardDescription>
                    Created: {mindMap.createdAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-32 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                    {mindMap.thumbnailUrl ? (
                      <img
                        src={mindMap.thumbnailUrl}
                        alt={mindMap.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      "No preview available"
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMindMap(mindMap.id, mindMap.name)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEditMindMap(mindMap.name)}
                  >
                    <FileEdit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No mind maps</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new mind map.
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Mind Map
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
