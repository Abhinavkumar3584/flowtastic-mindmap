
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { MindMapData, EXAM_CATEGORIES } from "@/components/mindmap/types";
import { getMindMapsByCategory } from "@/utils/mindmapStorage";
import { FileText, Plus } from "lucide-react";

const ExamsData = () => {
  const [activeTab, setActiveTab] = useState(EXAM_CATEGORIES[0]);
  const [mindMaps, setMindMaps] = useState<MindMapData[]>([]);
  const navigate = useNavigate();

  // Load mind maps when the active tab changes
  useEffect(() => {
    const maps = getMindMapsByCategory(activeTab);
    setMindMaps(maps);
  }, [activeTab]);

  // Get unique subcategories to display as cards
  const uniqueSubcategories = Array.from(
    new Set(mindMaps.map(map => map.examSubcategory))
  ).filter(Boolean) as string[];

  const handleExamCardClick = (subcategory: string) => {
    // Find the mind map with this subcategory
    const mindMap = mindMaps.find(map => map.examSubcategory === subcategory);
    if (mindMap) {
      navigate(`/?map=${encodeURIComponent(mindMap.name)}`);
    }
  };

  const handleCreateNewMindMap = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Exam Categories</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with exam categories */}
        <div className="md:w-1/4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="font-semibold mb-4 text-lg">Categories</h2>
            <Tabs 
              orientation="vertical" 
              value={activeTab} 
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="flex flex-col space-y-1 h-auto bg-transparent">
                {EXAM_CATEGORIES.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className={cn(
                      "justify-start px-3 py-2 text-left transition-all duration-200 hover:bg-slate-100 rounded-md data-[state=active]:shadow-none data-[state=active]:bg-slate-200 data-[state=active]:text-primary font-medium",
                      activeTab === category 
                        ? "border-l-4 border-primary" 
                        : "border-l-4 border-transparent"
                    )}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Right content area with sub-exams */}
        <div className="md:w-3/4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">{activeTab} Exams</h2>
              <Button onClick={handleCreateNewMindMap} size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Create New Mind Map
              </Button>
            </div>
            <Separator className="mb-4" />
            
            {uniqueSubcategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniqueSubcategories.map((subcategory) => (
                  <Card 
                    key={subcategory} 
                    className="hover:shadow-lg transition-all duration-200 animate-fade-in cursor-pointer"
                    onClick={() => handleExamCardClick(subcategory)}
                  >
                    <CardContent className="flex items-center p-4">
                      <div className="text-2xl mr-3">
                        <FileText className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">{subcategory}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No mind maps created for this category yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleCreateNewMindMap}
                >
                  Create Your First Mind Map
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsData;
