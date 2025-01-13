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

const getNodeStyle = (data: BaseNodeData) => {
  switch (data.nodeType) {
    case 'topic':
      return 'bg-yellow-300 border border-yellow-400';
    case 'subtopic':
      return 'bg-[#f5e6d3] border border-[#e6d5c3]';
    case 'button':
      return 'bg-blue-500 text-white rounded-md';
    case 'section':
      return 'bg-transparent border-2 border-dashed border-gray-300';
    case 'horizontalLine':
    case 'verticalLine':
      return '';
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

  if (data.nodeType === 'horizontalLine') {
    return (
      <div className="relative">
        <NodeResizer 
          minWidth={100}
          minHeight={2}
          isVisible={selected}
          lineClassName="border-mindmap-primary"
          handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
        />
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-mindmap-primary" />
        <div 
          className="h-0.5 bg-gray-300 min-w-[100px]"
          style={{
            backgroundColor: nodeData.lineStyle?.color || '#CBD5E1',
            height: `${nodeData.lineStyle?.width || 2}px`,
            borderStyle: nodeData.lineStyle?.style || 'solid'
          }}
        />
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-mindmap-primary" />
        {selected && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="absolute -top-8 right-0">
                Line Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 font-medium">Line Color</h4>
                  <div className="flex gap-2">
                    {['#CBD5E1', '#3B82F6', '#10B981', '#EF4444', '#F59E0B'].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${
                          nodeData.lineStyle?.color === color ? 'ring-2 ring-primary' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleSettingsChange({ 
                          lineStyle: { 
                            ...nodeData.lineStyle,
                            color 
                          }
                        })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Line Width</h4>
                  <Slider
                    value={[nodeData.lineStyle?.width || 2]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={([value]) => handleSettingsChange({
                      lineStyle: {
                        ...nodeData.lineStyle,
                        width: value
                      }
                    })}
                  />
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Line Style</h4>
                  <div className="flex gap-2">
                    {['solid', 'dashed'].map((style) => (
                      <Button
                        key={style}
                        variant={nodeData.lineStyle?.style === style ? "default" : "outline"}
                        onClick={() => handleSettingsChange({
                          lineStyle: {
                            ...nodeData.lineStyle,
                            style: style as 'solid' | 'dashed'
                          }
                        })}
                      >
                        {style === 'solid' ? '—' : '- -'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    );
  }

  if (data.nodeType === 'verticalLine') {
    return (
      <div className="relative">
        <NodeResizer 
          minWidth={2}
          minHeight={100}
          isVisible={selected}
          lineClassName="border-mindmap-primary"
          handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
        />
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-mindmap-primary" />
        <div 
          className="w-0.5 bg-gray-300 min-h-[100px]"
          style={{
            backgroundColor: nodeData.lineStyle?.color || '#CBD5E1',
            width: `${nodeData.lineStyle?.width || 2}px`,
            borderStyle: nodeData.lineStyle?.style || 'solid'
          }}
        />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-mindmap-primary" />
        {selected && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="absolute -right-20 top-0">
                Line Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 font-medium">Line Color</h4>
                  <div className="flex gap-2">
                    {['#CBD5E1', '#3B82F6', '#10B981', '#EF4444', '#F59E0B'].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${
                          nodeData.lineStyle?.color === color ? 'ring-2 ring-primary' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleSettingsChange({ 
                          lineStyle: { 
                            ...nodeData.lineStyle,
                            color 
                          }
                        })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Line Width</h4>
                  <Slider
                    value={[nodeData.lineStyle?.width || 2]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={([value]) => handleSettingsChange({
                      lineStyle: {
                        ...nodeData.lineStyle,
                        width: value
                      }
                    })}
                  />
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Line Style</h4>
                  <div className="flex gap-2">
                    {['solid', 'dashed'].map((style) => (
                      <Button
                        key={style}
                        variant={nodeData.lineStyle?.style === style ? "default" : "outline"}
                        onClick={() => handleSettingsChange({
                          lineStyle: {
                            ...nodeData.lineStyle,
                            style: style as 'solid' | 'dashed'
                          }
                        })}
                      >
                        {style === 'solid' ? '—' : '- -'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    );
  }

  const nodeStyle = getNodeStyle(data);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`min-w-[100px] min-h-[40px] ${nodeStyle} 
                     flex items-center justify-center p-4 transition-colors
                     hover:border-mindmap-node-selected relative`}
          style={{
            opacity: nodeData.opacity || 1,
            textAlign: nodeData.textAlign || 'center',
          }}
          onDoubleClick={handleDoubleClick}
        >
          <NodeResizer 
            minWidth={100}
            minHeight={40}
            isVisible={selected}
            lineClassName="border-mindmap-primary"
            handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
          />
          <Handle type="target" position={Position.Top} className="w-3 h-3 bg-mindmap-primary" />
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
          <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-mindmap-primary" />
          {selected && <NodeSettings data={nodeData} onChange={handleSettingsChange} />}
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