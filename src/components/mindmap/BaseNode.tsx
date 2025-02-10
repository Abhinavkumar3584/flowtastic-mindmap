import { useState, useEffect } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { NodeSettings } from './NodeSettings';
import { NodeConnectors } from './NodeConnectors';
import { MindMapNodeProps, BaseNodeData, FontSize, LegendPosition } from './types';
import { FileText, Check } from 'lucide-react';
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
      return 'bg-[#E5DEFF] rounded-lg shadow-md';
    case 'topic':
      return 'bg-[#FEF7CD] border border-black/20 rounded';
    case 'subtopic':
      return 'bg-[#FDE1D3] border-2 border-black/20 rounded-lg';
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

  const getLegendPosition = (position: LegendPosition): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: `2px solid ${nodeData.legend?.color || '#000000'}`,
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    };

    switch (position) {
      case 'left-top':
        return { ...base, left: '-10px', top: '-10px' };
      case 'left-center':
        return { ...base, left: '-10px', top: '50%', transform: 'translateY(-50%)' };
      case 'left-bottom':
        return { ...base, left: '-10px', bottom: '-10px' };
      case 'right-top':
        return { ...base, right: '-10px', top: '-10px' };
      case 'right-center':
        return { ...base, right: '-10px', top: '50%', transform: 'translateY(-50%)' };
      case 'right-bottom':
        return { ...base, right: '-10px', bottom: '-10px' };
      default:
        return base;
    }
  };

  if (!nodeData) return null;

  const hasContent = !!(nodeData.content?.title || nodeData.content?.description || (nodeData.content?.links && nodeData.content.links.length > 0));
  const nodeStyle = getNodeStyle(nodeData.nodeType);
  const fontSize = getFontSize(nodeData.fontSize as FontSize);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <NodeContainer
          nodeStyle={nodeStyle}
          nodeData={nodeData}
          selected={selected}
          onDoubleClick={handleDoubleClick}
        >
          <NodeConnectors />
          
          {hasContent && (
            <div className="absolute top-1 right-1 text-gray-500">
              <FileText className="h-4 w-4" />
            </div>
          )}

          {nodeData.legend?.enabled && (
            <div style={getLegendPosition(nodeData.legend.position)}>
              <Check
                className="h-3 w-3"
                style={{ color: nodeData.legend.color }}
              />
            </div>
          )}

          <div className="w-full h-full flex items-center justify-center">
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
