
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Mock data for exams
const examsData = {
  UPSC: [
    { id: 1, name: "Civil Services Examination (CSE)", icon: "📚" },
    { id: 2, name: "Combined Defence Services (CDS)", icon: "🛡️" },
    { id: 3, name: "National Defence Academy (NDA)", icon: "🎖️" },
    { id: 4, name: "Engineering Services Examination", icon: "🔧" },
    { id: 5, name: "Combined Medical Services", icon: "🏥" },
    { id: 6, name: "Indian Forest Service", icon: "🌳" },
  ],
  SSC: [
    { id: 1, name: "Combined Graduate Level (CGL)", icon: "🎓" },
    { id: 2, name: "Combined Higher Secondary Level (CHSL)", icon: "📝" },
    { id: 3, name: "Junior Engineer (JE)", icon: "⚙️" },
    { id: 4, name: "Multi Tasking Staff (MTS)", icon: "👷" },
    { id: 5, name: "Stenographer Grade C & D", icon: "⌨️" },
  ],
  Banking: [
    { id: 1, name: "SBI PO", icon: "🏦" },
    { id: 2, name: "SBI Clerk", icon: "💼" },
    { id: 3, name: "IBPS PO", icon: "📊" },
    { id: 4, name: "IBPS Clerk", icon: "📋" },
    { id: 5, name: "RBI Grade B", icon: "💰" },
    { id: 6, name: "RBI Assistant", icon: "📈" },
    { id: 7, name: "NABARD", icon: "🌾" },
  ],
  Railways: [
    { id: 1, name: "RRB NTPC", icon: "🚂" },
    { id: 2, name: "RRB Group D", icon: "🛤️" },
    { id: 3, name: "RRB ALP", icon: "🚆" },
    { id: 4, name: "RRB JE", icon: "🔌" },
  ],
  Teaching: [
    { id: 1, name: "CTET", icon: "👨‍🏫" },
    { id: 2, name: "STET", icon: "👩‍🏫" },
    { id: 3, name: "KVS", icon: "🏫" },
    { id: 4, name: "NVS", icon: "🏫" },
    { id: 5, name: "DSSSB", icon: "📕" },
  ],
  Defence: [
    { id: 1, name: "AFCAT", icon: "✈️" },
    { id: 2, name: "CDS", icon: "🎖️" },
    { id: 3, name: "CAPF", icon: "🛡️" },
    { id: 4, name: "Indian Navy", icon: "⚓" },
    { id: 5, name: "Indian Army", icon: "🪖" },
  ],
};

const ExamsData = () => {
  const examCategories = Object.keys(examsData);
  const [activeTab, setActiveTab] = useState(examCategories[0]);

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
                {examCategories.map((category) => (
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
              {examsData[activeTab as keyof typeof examsData].map((exam) => (
                <Card 
                  key={exam.id} 
                  className="hover:shadow-lg transition-all duration-200 animate-fade-in"
                >
                  <CardContent className="flex items-center p-4">
                    <div className="text-2xl mr-3">{exam.icon}</div>
                    <div>
                      <p className="font-medium">{exam.name}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamsData;
