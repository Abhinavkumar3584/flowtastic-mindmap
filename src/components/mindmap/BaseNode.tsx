import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Textarea } from "@/components/ui/textarea";
import { NodeSettings } from './NodeSettings';
import { BaseNodeData } from './types';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const getNodeStyle = (nodeType?: string) => {
  switch (nodeType) {
    case 'title':
      return 'bg-transparent'; // Remove background and border for title
    case 'topic':
      return 'bg-yellow-300 border border-yellow-400';
    case 'subtopic':
      return 'bg-[#f5e6d3] border border-[#e6d5c3]';
    case 'button':
      return 'bg-blue-500 text-white rounded-md';
    case 'section':
      return 'bg-transparent border-2 border-dashed border-gray-300';
    case 'horizontalLine':
      return 'h-0.5 bg-gray-300 min-w-[100px]';
    case 'verticalLine':
      return 'w-0.5 bg-gray-300 min-h-[100px]';
    default:
      return 'bg-white border border-gray-200';
  }
};

export const BaseNode = ({ data, id, selected }: NodeProps<BaseNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [nodeData, setNodeData] = useState<BaseNodeData>(data);

  const handleDoubleClick = () => {
    if (!['horizontalLine', 'verticalLine'].includes(data.nodeType || '')) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const handleSettingsChange = (updates: Partial<BaseNodeData>) => {
    setNodeData(prev => ({ ...prev, ...updates }));
  };

  const nodeStyle = getNodeStyle(data.nodeType);

  if (data.nodeType === 'horizontalLine') {
    return (
      <div className="relative group">
        <NodeResizer 
          minWidth={100}
          minHeight={4}
          isVisible={selected}
          lineClassName="border-blue-500"
          handleClassName="h-3 w-3 bg-white border-2 border-blue-500 rounded"
        />
        <div 
          className={`${nodeStyle} transition-all duration-200`}
          style={{
            backgroundColor: nodeData.strokeColor || '#e5e7eb',
            height: `${nodeData.strokeWidth || 2}px`,
            opacity: nodeData.opacity || 1,
            borderStyle: nodeData.strokeStyle || 'solid'
          }}
        />
        {selected && (
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute -right-24 top-1/2 -translate-y-1/2"
              >
                Edit Line
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 font-medium">Line Color</h4>
                  <div className="flex gap-2">
                    {['#e5e7eb', '#000000', '#2563eb', '#dc2626', '#16a34a'].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border ${
                          nodeData.strokeColor === color ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleSettingsChange({ strokeColor: color })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Line Width</h4>
                  <Slider
                    value={[nodeData.strokeWidth || 2]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={([value]) => handleSettingsChange({ strokeWidth: value })}
                  />
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Line Style</h4>
                  <div className="flex gap-2">
                    {['solid', 'dashed', 'dotted'].map((style) => (
                      <Button
                        key={style}
                        variant={nodeData.strokeStyle === style ? "default" : "outline"}
                        onClick={() => handleSettingsChange({ strokeStyle: style as 'solid' | 'dashed' | 'dotted' })}
                      >
                        {style === 'solid' ? '—' : style === 'dashed' ? '- -' : '...'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Opacity</h4>
                  <Slider
                    value={[nodeData.opacity || 1]}
                    min={0.1}
                    max={1}
                    step={0.1}
                    onValueChange={([value]) => handleSettingsChange({ opacity: value })}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    );
  }

  if (data.nodeType === 'verticalLine') {
    return <div className={nodeStyle} />;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`min-w-[100px] min-h-[40px] ${nodeStyle} 
                     flex items-center justify-center p-4
                     ${data.nodeType !== 'title' ? 'hover:border-mindmap-node-selected' : ''} relative`}
          style={{
            opacity: nodeData.opacity || 1,
            textAlign: nodeData.textAlign || 'center',
          }}
          onDoubleClick={handleDoubleClick}
        >
          {data.nodeType !== 'title' && (
            <NodeResizer 
              minWidth={100}
              minHeight={40}
              isVisible={selected}
              lineClassName="border-mindmap-primary"
              handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
            />
          )}
          
          {/* Add handles on all sides for title node */}
          {data.nodeType === 'title' ? (
            <>
              <Handle type="source" position={Position.Top} className="w-3 h-3 bg-mindmap-primary" />
              <Handle type="source" position={Position.Right} className="w-3 h-3 bg-mindmap-primary" />
              <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-mindmap-primary" />
              <Handle type="source" position={Position.Left} className="w-3 h-3 bg-mindmap-primary" />
            </>
          ) : (
            <>
              <Handle type="target" position={Position.Top} className="w-3 h-3 bg-mindmap-primary" />
              <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-mindmap-primary" />
            </>
          )}

          {isEditing ? (
            <Textarea
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-center outline-none w-full resize-none"
              autoFocus
            />
          ) : (
            <div className={data.nodeType === 'title' ? 'text-xl font-bold' : ''}>
              {label}
            </div>
          )}
          
          {selected && data.nodeType !== 'title' && <NodeSettings data={nodeData} onChange={handleSettingsChange} />}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => window.mindmapApi?.deleteNode(id)}>
          Delete Node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};