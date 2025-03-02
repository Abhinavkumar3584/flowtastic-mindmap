
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
  CheckSquare,
  Clock,
  BookOpen,
  ChevronLeft,
  GraduationCap
} from "lucide-react";

interface AdvancedComponentsSidebarProps {
  onAddNode: (type: string) => void;
  onToggleSidebar: () => void;
}

export const AdvancedComponentsSidebar = ({ 
  onAddNode,
  onToggleSidebar,
}: AdvancedComponentsSidebarProps) => {
  return (
    <Sidebar variant="floating" className="w-64">
      <SidebarHeader className="border-b">
        <div className="px-2 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Advanced Tools</h2>
            <p className="text-sm text-gray-500">Educational components</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onToggleSidebar}
            title="Basic Components"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Study Components</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("checklist")}
            >
              <CheckSquare className="h-4 w-4" />
              <span>Checklist</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("timeline")}
            >
              <Clock className="h-4 w-4" />
              <span>Timeline</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("resource")}
            >
              <BookOpen className="h-4 w-4" />
              <span>Resource</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Features</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
              <p className="mb-2">These educational components help with:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Tracking study progress</li>
                <li>Planning exam preparation</li>
                <li>Organizing study resources</li>
                <li>Creating complete syllabus maps</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded border border-blue-100">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-blue-700">Perfect for exam preparation</span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
