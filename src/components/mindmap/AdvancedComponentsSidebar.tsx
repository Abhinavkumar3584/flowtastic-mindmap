
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
  Link2,
  ChevronRight,
  ChevronLeft,
  Table,
  BarChart,
  Trello,
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
            <p className="text-sm text-gray-500">Specialized mind map components</p>
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
          <SidebarGroupLabel>Organizational Components</SidebarGroupLabel>
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
              <Link2 className="h-4 w-4" />
              <span>Resources</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Data Visualization</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("table")}
            >
              <Table className="h-4 w-4" />
              <span>Table</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("chart")}
            >
              <BarChart className="h-4 w-4" />
              <span>Chart</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("kanban")}
            >
              <Trello className="h-4 w-4" />
              <span>Kanban Board</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
