
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
  ListTodo,
  Timer,
  FileText,
  ChevronRight,
  StickyNote,
  Lightbulb,
  BookOpen,
  GraduationCap,
  BarChart
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
            <h2 className="text-lg font-semibold">Advanced Components</h2>
            <p className="text-sm text-gray-500">Specialized node types</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onToggleSidebar}
            title="Education Components"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Productivity</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("checklist")}
            >
              <ListTodo className="h-4 w-4" />
              <span>Checklist</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("timeline")}
            >
              <Timer className="h-4 w-4" />
              <span>Timeline</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("resource")}
            >
              <FileText className="h-4 w-4" />
              <span>Resources</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("note")}
            >
              <StickyNote className="h-4 w-4" />
              <span>Note</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("concept")}
            >
              <Lightbulb className="h-4 w-4" />
              <span>Concept</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
