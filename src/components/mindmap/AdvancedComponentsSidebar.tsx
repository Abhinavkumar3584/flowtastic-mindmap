
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarClose, SidebarContent } from '@/components/ui/sidebar';
import { 
  Box, Circle, Square, Triangle, 
  FileText, CheckSquare, Clock, Library,
  Lightbulb, Image, NotepadText, ListTodo, Trello
} from 'lucide-react';
import { BaseNodeData } from './types';

interface AdvancedComponentsSidebarProps {
  onAddNode: (type: BaseNodeData['nodeType'], data?: Partial<BaseNodeData>) => void;
  onToggleSidebar: () => void;
}

export const AdvancedComponentsSidebar: React.FC<AdvancedComponentsSidebarProps> = ({ 
  onAddNode,
  onToggleSidebar
}) => {
  return (
    <Sidebar defaultWidth={280} minWidth={200} maxWidth={400}>
      <SidebarContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Advanced Components</h2>
          <SidebarClose>
            <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
              Next →
            </Button>
          </SidebarClose>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto">
          <div>
            <h3 className="font-medium mb-2 text-sm text-gray-600">Shapes</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('rectangle')}
              >
                <Box className="h-6 w-6 mb-1" />
                <span className="text-xs">Rectangle</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('circle')}
              >
                <Circle className="h-6 w-6 mb-1" />
                <span className="text-xs">Circle</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('square')}
              >
                <Square className="h-6 w-6 mb-1" />
                <span className="text-xs">Square</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('triangle')}
              >
                <Triangle className="h-6 w-6 mb-1" />
                <span className="text-xs">Triangle</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 text-sm text-gray-600">Education</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('checklist')}
              >
                <CheckSquare className="h-6 w-6 mb-1" />
                <span className="text-xs">Checklist</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('timeline')}
              >
                <Clock className="h-6 w-6 mb-1" />
                <span className="text-xs">Timeline</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('resource')}
              >
                <Library className="h-6 w-6 mb-1" />
                <span className="text-xs">Resources</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('mindmap')}
              >
                <Lightbulb className="h-6 w-6 mb-1" />
                <span className="text-xs">Mind Map</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 text-sm text-gray-600">New Components</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('action')}
              >
                <ListTodo className="h-6 w-6 mb-1" />
                <span className="text-xs">Action</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('note')}
              >
                <NotepadText className="h-6 w-6 mb-1" />
                <span className="text-xs">Note</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('image')}
              >
                <Image className="h-6 w-6 mb-1" />
                <span className="text-xs">Image</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col"
                onClick={() => onAddNode('process')}
              >
                <Trello className="h-6 w-6 mb-1" />
                <span className="text-xs">Process</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-2 flex-col cols-span-2 w-full"
                onClick={() => onAddNode('concept')}
              >
                <Lightbulb className="h-6 w-6 mb-1" />
                <span className="text-xs">Concept</span>
              </Button>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
