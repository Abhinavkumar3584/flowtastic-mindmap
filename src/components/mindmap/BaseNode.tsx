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
    case 'title':
      return 'bg-transparent';
    case 'topic':
      return 'bg-yellow-300 border border-yellow-400';
    case 'subtopic':
      return 'bg-[#f5e6d3] border border-[#e6d5c3]';
    case 'rectangle':
      return 'bg-white border border-gray-200';
    case 'diamond':
      return 'bg-white border border-gray-200 rotate-45';
    case 'circle':
      return 'bg-white border border-gray-200 rounded-full';
    default:
      return 'bg-white border border-gray-200';
  }
};

export const BaseNode = ({ data, id, selected }: NodeProps<BaseNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [nodeData, setNodeData] = useState<BaseNodeData>(data);

  const handleDoubleClick = () => {
    setIsEditing(true);
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
  const isDiamond = data.nodeType === 'diamond';
  const isCircle = data.nodeType === 'circle';

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`min-w-[100px] min-h-[100px] ${nodeStyle} 
                     flex items-center justify-center p-4 relative
                     ${data.nodeType !== 'title' ? 'hover:border-mindmap-node-selected' : ''}`}
          style={{
            opacity: nodeData.opacity || 1,
            textAlign: nodeData.textAlign || 'center',
            fontSize: `${nodeData.fontSize || 12}px`,
            transform: isDiamond ? 'rotate(45deg)' : 'none',
            aspectRatio: isCircle ? '1 / 1' : 'auto',
          }}
          onDoubleClick={handleDoubleClick}
        >
          {data.nodeType !== 'title' && (
            <NodeResizer 
              minWidth={100}
              minHeight={isCircle ? 100 : 40}
              isVisible={selected}
              lineClassName="border-mindmap-primary"
              handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
              keepAspectRatio={isCircle}
            />
          )}
          
          <Handle type="target" position={Position.Top} className="w-3 h-3 bg-mindmap-primary" />
          <Handle type="source" position={Position.Right} className="w-3 h-3 bg-mindmap-primary" />
          <Handle type="target" position={Position.Bottom} className="w-3 h-3 bg-mindmap-primary" />
          <Handle type="source" position={Position.Left} className="w-3 h-3 bg-mindmap-primary" />

          <div 
            style={{ 
              transform: isDiamond ? 'rotate(-45deg)' : 'none',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isEditing ? (
              <Textarea
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="bg-transparent text-center outline-none w-full resize-none"
                autoFocus
                style={{ fontSize: `${nodeData.fontSize || 12}px` }}
              />
            ) : (
              <div className={data.nodeType === 'title' ? 'text-xl font-bold' : ''}>
                {label}
              </div>
            )}
          </div>
          
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