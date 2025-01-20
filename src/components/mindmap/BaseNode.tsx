import { useState, useEffect } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { NodeSettings } from './NodeSettings';
import { NodeConnectors } from './NodeConnectors';
import { MindMapNodeProps, BaseNodeData, FontSize } from './types';
import { FileText } from 'lucide-react';
import { NodeLabel } from './node-components/NodeLabel';
import { NodeContainer } from './node-components/NodeContainer';

const getFontSize = (size: FontSize | undefined): number => {
  switch (size) {
    case 'xs': return 12;
    case 's': return 14;
    case 'm': return 16;
    case 'l': return 20;
    case 'xl': return 24;
    default: return 12;
  }
};

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
  const [label, setLabel] = useState(data.label || '');
  const [nodeData, setNodeData] = useState<BaseNodeData>(data);

  useEffect(() => {
    if (data) {
      setNodeData(data);
      setLabel(data.label);
    }
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

  if (!nodeData) return null;

  const hasContent = !!(nodeData.content?.title || nodeData.content?.description || (nodeData.content?.links && nodeData.content.links.length > 0));
  const nodeStyle = getNodeStyle(nodeData.nodeType);
  const isDiamond = nodeData.nodeType === 'diamond';
  const isCircle = nodeData.nodeType === 'circle';
  const fontSize = getFontSize(nodeData.fontSize as FontSize);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <NodeContainer
          nodeStyle={nodeStyle}
          nodeData={nodeData}
          selected={selected}
          isCircle={isCircle}
          isDiamond={isDiamond}
          onDoubleClick={handleDoubleClick}
        >
          <NodeConnectors />

          {hasContent && (
            <div className="absolute top-1 right-1 text-gray-500">
              <FileText className="h-4 w-4" />
            </div>
          )}

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
            <NodeLabel
              label={label}
              fontSize={fontSize}
              fontFamily={nodeData.fontFamily}
              isEditing={isEditing}
              onLabelChange={setLabel}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          {selected && <NodeSettings data={nodeData} nodeId={id} />}
        </NodeContainer>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => window.mindmapApi?.deleteNode(id)}>
          Delete Node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};