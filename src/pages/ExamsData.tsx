
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { EXAM_CATEGORIES, MindMapData } from "@/components/mindmap/types";
import { getMindMapsByExamCategory, getMindMapBySubExam } from "@/utils/mindmapStorage";
import { ExportedMindMap } from "@/components/mindmap/ExportedMindMap";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Interface for exam data
interface ExamItem {
  id: number;
  name: string;
  icon: string;
}

// Mock data for exams - this would be replaced by actual data from API or database
const examsData: Record<string, ExamItem[]> = {
  "SSC EXAMS": [
    { id: 1, name: "Combined Graduate Level (CGL)", icon: "🎓" },
    { id: 2, name: "Combined Higher Secondary Level (CHSL)", icon: "📝" },
    { id: 3, name: "Junior Engineer (JE)", icon: "⚙️" },
    { id: 4, name: "Multi Tasking Staff (MTS)", icon: "👷" },
    { id: 5, name: "Stenographer Grade C & D", icon: "⌨️" },
  ],
  "BANKING EXAMS": [
    { id: 1, name: "SBI PO", icon: "🏦" },
    { id: 2, name: "SBI Clerk", icon: "💼" },
    { id: 3, name: "IBPS PO", icon: "📊" },
    { id: 4, name: "IBPS Clerk", icon: "📋" },
    { id: 5, name: "RBI Grade B", icon: "💰" },
    { id: 6, name: "RBI Assistant", icon: "📈" },
    { id: 7, name: "NABARD", icon: "🌾" },
  ],
  "CIVIL SERVICES EXAMS": [
    { id: 1, name: "Civil Services Examination (CSE)", icon: "📚" },
    { id: 2, name: "Combined Defence Services (CDS)", icon: "🛡️" },
    { id: 3, name: "National Defence Academy (NDA)", icon: "🎖️" },
    { id: 4, name: "Engineering Services Examination", icon: "🔧" },
    { id: 5, name: "Combined Medical Services", icon: "🏥" },
    { id: 6, name: "Indian Forest Service", icon: "🌳" },
  ],
  "RAILWAY EXAMS": [
    { id: 1, name: "RRB NTPC", icon: "🚂" },
    { id: 2, name: "RRB Group D", icon: "🛤️" },
    { id: 3, name: "RRB ALP", icon: "🚆" },
    { id: 4, name: "RRB JE", icon: "🔌" },
  ],
  "TEACHING EXAMS": [
    { id: 1, name: "CTET", icon: "👨‍🏫" },
    { id: 2, name: "STET", icon: "👩‍🏫" },
    { id: 3, name: "KVS", icon: "🏫" },
    { id: 4, name: "NVS", icon: "🏫" },
    { id: 5, name: "DSSSB", icon: "📕" },
  ],
  "DEFENCE EXAMS": [
    { id: 1, name: "AFCAT", icon: "✈️" },
    { id: 2, name: "CDS", icon: "🎖️" },
    { id: 3, name: "CAPF", icon: "🛡️" },
    { id: 4, name: "Indian Navy", icon: "⚓" },
    { id: 5, name: "Indian Army", icon: "🪖" },
  ],
};

const ExamsData = () => {
  const [activeTab, setActiveTab] = useState<string>(EXAM_CATEGORIES[0]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [availableExams, setAvailableExams] = useState<ExamItem[]>([]);
  const { toast } = useToast();

  // Initialize exams data for all categories
  useEffect(() => {
    const initializedExamsData: Record<string, ExamItem[]> = {};
    
    // Initialize all exam categories with empty arrays
    EXAM_CATEGORIES.forEach(category => {
      initializedExamsData[category] = examsData[category] || [];
    });
    
    // For each category, check for mind maps and update the exams list
    EXAM_CATEGORIES.forEach(category => {
      const mindMaps = getMindMapsByExamCategory(category);
      mindMaps.forEach(mindMap => {
        if (mindMap.subExamName && !initializedExamsData[category].find(exam => exam.name === mindMap.subExamName)) {
          // Add any sub-exams from mind maps that aren't in the mock data
          initializedExamsData[category].push({
            id: Date.now() + Math.random(),
            name: mindMap.subExamName,
            icon: "📝" // Default icon
          });
        }
      });
    });
    
    // Update the available exams for the active tab
    setAvailableExams(initializedExamsData[activeTab] || []);
  }, [activeTab]);

  // When tab changes, reset selected exam and update available exams
  useEffect(() => {
    setSelectedExam(null);
    setMindMapData(null);
    
    // Get mind maps for this category
    const mindMaps = getMindMapsByExamCategory(activeTab);
    const examsWithMindMaps = examsData[activeTab] || [];
    
    // Add any sub-exams from mind maps that aren't in the mock data
    mindMaps.forEach(mindMap => {
      if (mindMap.subExamName && !examsWithMindMaps.find(exam => exam.name === mindMap.subExamName)) {
        examsWithMindMaps.push({
          id: Date.now() + Math.random(),
          name: mindMap.subExamName,
          icon: "📝" // Default icon
        });
      }
    });
    
    setAvailableExams(examsWithMindMaps);
  }, [activeTab]);

  // Handle exam selection
  const handleExamClick = (examName: string) => {
    setSelectedExam(examName);
    
    // Try to load the mind map for this exam
    const mindMap = getMindMapBySubExam(activeTab, examName);
    if (mindMap) {
      setMindMapData(mindMap);
    } else {
      setMindMapData(null);
      toast({
        title: "No Mind Map Found",
        description: `No mind map found for ${examName}. Create one in the Mind Map tool first.`,
        variant: "destructive",
      });
    }
  };

  // Go back to exam list
  const handleBackToList = () => {
    setSelectedExam(null);
    setMindMapData(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Exam Categories</h1>
      
      {selectedExam && mindMapData ? (
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToList}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Exams
            </Button>
            <h2 className="font-semibold text-lg">{activeTab}: {selectedExam}</h2>
          </div>
          
          <div className="h-[calc(100vh-200px)]">
            <ExportedMindMap 
              predefinedMindMap={mindMapData} 
              containerHeight="100%" 
            />
          </div>
        </div>
      ) : (
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
              <h2 className="font-semibold mb-4 text-lg">{activeTab} Exams</h2>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableExams.map((exam) => (
                  <Card 
                    key={exam.id} 
                    className={cn(
                      "hover:shadow-lg cursor-pointer transition-all duration-200 animate-fade-in",
                      getMindMapBySubExam(activeTab, exam.name) ? "border-green-300 hover:border-green-500" : ""
                    )}
                    onClick={() => handleExamClick(exam.name)}
                  >
                    <CardContent className="flex items-center p-4">
                      <div className="text-2xl mr-3">{exam.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium">{exam.name}</p>
                        {getMindMapBySubExam(activeTab, exam.name) && (
                          <p className="text-xs text-green-600">Mind Map Available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsData;
