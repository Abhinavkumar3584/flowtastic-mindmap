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

const getNodeStyle = (nodeType?: string) => {
  switch (nodeType) {
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
    return <div className={nodeStyle} />;
  }

  if (data.nodeType === 'verticalLine') {
    return <div className={nodeStyle} />;
  }

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