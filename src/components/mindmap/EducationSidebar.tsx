
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  BrainCircuit,
  ChevronLeft,
  GraduationCap,
  FlaskConical,
  Library
} from "lucide-react";

interface EducationSidebarProps {
  onAddNode: (type: string) => void;
  onToggleSidebar: () => void;
}

export const EducationSidebar = ({ 
  onAddNode,
  onToggleSidebar,
}: EducationSidebarProps) => {
  return (
    <Sidebar variant="floating" className="w-64">
      <SidebarHeader className="border-b">
        <div className="px-2 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Education Tools</h2>
            <p className="text-sm text-gray-500">Learning components</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onToggleSidebar}
            title="Study Components"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Learning Components</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("flashcard")}
            >
              <Library className="h-4 w-4" />
              <span>Flashcards</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("quiz")}
            >
              <FlaskConical className="h-4 w-4" />
              <span>Quiz</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("mindmap")}
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Nested Map</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Benefits</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
              <p className="mb-2">These education components help with:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Active recall for better memorization</li>
                <li>Self-assessment of understanding</li>
                <li>Visual organization of complex concepts</li>
                <li>Efficient spaced repetition learning</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded border border-blue-100">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-blue-700">Enhanced learning retention</span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
