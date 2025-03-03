
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
  Heading1,
  CircleDot,
  Layers,
  AlignLeft,
  SquareIcon,
  ChevronRight,
  Circle,
  Square,
  Triangle,
} from "lucide-react";

interface ComponentsSidebarProps {
  onAddNode: (type: string) => void;
  onToggleSidebar: () => void;
}

export const ComponentsSidebar = ({ 
  onAddNode,
  onToggleSidebar,
}: ComponentsSidebarProps) => {
  return (
    <Sidebar variant="floating" className="w-64">
      <SidebarHeader className="border-b">
        <div className="px-2 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Mind Map Tools</h2>
            <p className="text-sm text-gray-500">Create and manage your mind map</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onToggleSidebar}
            title="Advanced Components"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("title")}
            >
              <Heading1 className="h-4 w-4" />
              <span>Title</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("topic")}
            >
              <CircleDot className="h-4 w-4" />
              <span>Topic</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("subtopic")}
            >
              <Layers className="h-4 w-4" />
              <span>Sub Topic</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("paragraph")}
            >
              <AlignLeft className="h-4 w-4" />
              <span>Paragraph</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("section")}
            >
              <SquareIcon className="h-4 w-4" />
              <span>Section</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Shapes</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("circle")}
            >
              <Circle className="h-4 w-4" />
              <span>Circle</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("rectangle")}
            >
              <SquareIcon className="h-4 w-4 rotate-90" />
              <span>Rectangle</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("square")}
            >
              <Square className="h-4 w-4" />
              <span>Square</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("triangle")}
            >
              <Triangle className="h-4 w-4" />
              <span>Triangle</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
