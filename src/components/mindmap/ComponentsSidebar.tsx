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
  Square,
  Diamond,
  Circle,
} from "lucide-react";

interface ComponentsSidebarProps {
  onAddNode: (type: string) => void;
  className?: string;
}

export const ComponentsSidebar = ({ 
  onAddNode,
  className
}: ComponentsSidebarProps) => {
  return (
    <Sidebar variant="floating" className={`w-64 ${className || ''}`}>
      <SidebarHeader className="border-b">
        <div className="px-2 py-4">
          <h2 className="text-lg font-semibold">Mind Map Tools</h2>
          <p className="text-sm text-gray-500">Create and manage your mind map</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Basic Shapes</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode('rectangle')}
            >
              <Square className="h-4 w-4" />
              <span>Rectangle</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode('diamond')}
            >
              <Diamond className="h-4 w-4" />
              <span>Diamond</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode('circle')}
            >
              <Circle className="h-4 w-4" />
              <span>Circle</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
