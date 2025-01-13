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
  Type,
  Square,
  List,
  ListTodo,
  Link,
  Minus,
  ArrowRight,
  SquareAsterisk,
  LayoutGrid,
  Lock,
  HandIcon,
  Diamond,
  Circle,
  Share2,
  Library,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ComponentsSidebarProps {
  onAddNode: (type: string) => void;
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
}

export const ComponentsSidebar = ({ 
  onAddNode,
  onSave,
  onLoad,
  onExport
}: ComponentsSidebarProps) => {
  const { toast } = useToast();

  return (
    <Sidebar variant="floating" className="w-64">
      <SidebarHeader className="border-b">
        <div className="px-2 py-4">
          <h2 className="text-lg font-semibold">Mind Map Tools</h2>
          <p className="text-sm text-gray-500">Create and manage your mind map</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1.5 p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={onSave}
            >
              <Lock className="h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={onLoad}
            >
              <Library className="h-4 w-4" />
              <span>Load</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={onExport}
            >
              <Share2 className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

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
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("label")}
            >
              <Type className="h-4 w-4" />
              <span>Label</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("legend")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>Legend</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("todo")}
            >
              <List className="h-4 w-4" />
              <span>Todo</span>
            </Button>
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
              onClick={() => onAddNode("linksGroup")}
            >
              <Link className="h-4 w-4" />
              <span>Links Group</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("horizontalLine")}
            >
              <Minus className="h-4 w-4" />
              <span>Horizontal Line</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("verticalLine")}
            >
              <ArrowRight className="h-4 w-4 rotate-90" />
              <span>Vertical Line</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onAddNode("resourceButton")}
            >
              <SquareAsterisk className="h-4 w-4" />
              <span>Resource Button</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};