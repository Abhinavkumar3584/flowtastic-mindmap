
import { useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { MindMapNodeProps } from '../types';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut 
} from "@/components/ui/context-menu";
import { Copy, Clipboard, Trash2, CopyPlus, Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Border colors for sections
const borderColors = [
  '#8E9196', // Neutral Gray
  '#9b87f5', // Primary Purple
  '#7E69AB', // Secondary Purple
  '#1A1F2C', // Dark Purple
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#D946EF', // Magenta Pink
  '#ea384c'  // Red
];

export const SectionNode = ({ data, id, selected }: MindMapNodeProps) => {
  const [nodeData, setNodeData] = useState(data);

  if (!nodeData) return null;
  
  const isSelected = selected ? true : false;

  const handleCopy = () => {
    window.mindmapApi?.copyNode?.(id);
  };

  const handlePaste = () => {
    window.mindmapApi?.pasteNode?.(id);
  };

  const handleDuplicate = () => {
    window.mindmapApi?.duplicateNode?.(id);
  };

  const handleDelete = () => {
    window.mindmapApi?.deleteNode(id);
  };

  const handleDataChange = (updates: Partial<typeof nodeData>) => {
    window.mindmapApi?.updateNodeData(id, updates);
    setNodeData({ ...nodeData, ...updates });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="min-w-[200px] min-h-[100px] relative"
          style={{
            backgroundColor: 'transparent',
            border: `${nodeData.strokeWidth || 1}px ${nodeData.strokeStyle || 'dashed'} ${nodeData.strokeColor || '#000'}`,
            borderRadius: `${nodeData.borderRadius || 4}px`,
            padding: '8px'
          }}
        >
          <NodeResizer 
            minWidth={200}
            minHeight={100}
            isVisible={isSelected}
            lineClassName="border-mindmap-primary"
            handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
          />

          {isSelected && (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2 z-50"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
                <div className="space-y-6 py-6">
                  <div className="space-y-2">
                    <Label>Section Label</Label>
                    <Input 
                      value={nodeData.label || ''}
                      onChange={(e) => handleDataChange({ label: e.target.value })}
                      placeholder="Enter section label"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Border Width</Label>
                    <Slider
                      defaultValue={[nodeData.strokeWidth || 1]}
                      max={5}
                      min={1}
                      step={1}
                      onValueChange={(value) => handleDataChange({ strokeWidth: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <Slider
                      defaultValue={[nodeData.borderRadius || 4]}
                      max={20}
                      min={0}
                      step={1}
                      onValueChange={(value) => handleDataChange({ borderRadius: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Border Style</Label>
                    <RadioGroup 
                      defaultValue={nodeData.strokeStyle || "dashed"}
                      onValueChange={(value) => handleDataChange({ 
                        strokeStyle: value as 'solid' | 'dashed' | 'dotted' 
                      })}
                      className="grid grid-cols-3 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="solid" id="solid" />
                        <Label htmlFor="solid">Solid</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dashed" id="dashed" />
                        <Label htmlFor="dashed">Dashed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dotted" id="dotted" />
                        <Label htmlFor="dotted">Dotted</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Border Color</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {borderColors.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 ${
                            nodeData.strokeColor === color ? 'ring-2 ring-primary' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleDataChange({ strokeColor: color })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          <Handle
            type="source"
            position={Position.Top}
            id="top"
            className="w-3 h-3 !bg-mindmap-primary"
          />
          <Handle
            type="target"
            position={Position.Top}
            id="top-target"
            className="w-3 h-3 !bg-mindmap-primary"
          />
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="w-3 h-3 !bg-mindmap-primary"
          />
          <Handle
            type="target"
            position={Position.Right}
            id="right-target"
            className="w-3 h-3 !bg-mindmap-primary"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            className="w-3 h-3 !bg-mindmap-primary"
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id="bottom-target"
            className="w-3 h-3 !bg-mindmap-primary"
          />
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            className="w-3 h-3 !bg-mindmap-primary"
          />
          <Handle
            type="target"
            position={Position.Left}
            id="left-target"
            className="w-3 h-3 !bg-mindmap-primary"
          />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onSelect={handleCopy} className="flex items-center">
          <Copy className="h-4 w-4 mr-2" />
          Copy
          <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handlePaste} className="flex items-center">
          <Clipboard className="h-4 w-4 mr-2" />
          Paste
          <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={handleDuplicate} className="flex items-center">
          <CopyPlus className="h-4 w-4 mr-2" />
          Duplicate
          <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={handleDelete} className="flex items-center text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Section
          <ContextMenuShortcut>Delete</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
