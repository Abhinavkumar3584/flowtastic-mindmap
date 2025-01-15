import { NodeResizer } from '@xyflow/react';
import { useState, useEffect } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Textarea } from "@/components/ui/textarea";
import { NodeSettings } from './NodeSettings';
import { NodeConnectors } from './NodeConnectors';
import { MindMapNodeProps, BaseNodeData } from './types';

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

export const BaseNode = ({ data, id, selected }: MindMapNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [nodeData, setNodeData] = useState<BaseNodeData>(data);

  useEffect(() => {
    setNodeData(data);
    setLabel(data.label);
  }, [data]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    window.mindmapApi?.updateNodeData(id, { label });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      window.mindmapApi?.updateNodeData(id, { label });
    }
  };

  const nodeStyle = getNodeStyle(nodeData.nodeType);
  const isDiamond = nodeData.nodeType === 'diamond';
  const isCircle = nodeData.nodeType === 'circle';

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`min-w-[100px] min-h-[100px] ${nodeStyle} 
                     flex items-center justify-center p-4 relative
                     ${nodeData.nodeType !== 'title' ? 'hover:border-mindmap-node-selected' : ''}`}
          style={{
            backgroundColor: nodeData.backgroundColor,
            borderColor: nodeData.strokeColor,
            borderWidth: nodeData.strokeWidth,
            borderStyle: nodeData.strokeStyle,
            opacity: nodeData.opacity || 1,
            textAlign: nodeData.textAlign || 'center',
            fontSize: `${nodeData.fontSize || 12}px`,
            fontFamily: nodeData.fontFamily,
            transform: isDiamond ? 'rotate(45deg)' : 'none',
            aspectRatio: isCircle ? '1 / 1' : 'auto',
          }}
          onDoubleClick={handleDoubleClick}
        >
          {nodeData.nodeType !== 'title' && (
            <NodeResizer 
              minWidth={100}
              minHeight={isCircle ? 100 : 40}
              isVisible={selected}
              lineClassName="border-mindmap-primary"
              handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
              keepAspectRatio={isCircle}
            />
          )}
          
          <NodeConnectors />

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
                style={{ 
                  fontSize: `${nodeData.fontSize || 12}px`,
                  fontFamily: nodeData.fontFamily 
                }}
              />
            ) : (
              <div 
                className={nodeData.nodeType === 'title' ? 'text-xl font-bold' : ''}
                style={{ fontFamily: nodeData.fontFamily }}
              >
                {label}
              </div>
            )}
          </div>
          
          {selected && <NodeSettings data={nodeData} nodeId={id} />}
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