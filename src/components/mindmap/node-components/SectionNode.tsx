
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
import { Copy, Clipboard, Trash2, CopyPlus } from 'lucide-react';

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
