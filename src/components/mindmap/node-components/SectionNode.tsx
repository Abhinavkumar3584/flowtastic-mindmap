
import { useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { MindMapNodeProps } from '../types';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

export const SectionNode = ({ data, id, selected }: MindMapNodeProps) => {
  const [nodeData, setNodeData] = useState(data);

  if (!nodeData) return null;
  
  const isSelected = selected ? true : false;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="min-w-[200px] min-h-[100px] relative"
          style={{
            backgroundColor: 'transparent',
            border: `${nodeData.strokeWidth || 1}px ${nodeData.strokeStyle || 'dashed'} ${nodeData.strokeColor || '#000'}`,
            borderRadius: '4px',
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
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => window.mindmapApi?.deleteNode(id)}>
          Delete Section
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
