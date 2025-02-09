
import { useEffect, useState } from 'react';
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
  const [nodeData, setNodeData] = useState<BaseNodeData>(data);

  useEffect(() => {
    if (data) {
      setNodeData(data);
    }
  }, [data]);

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
          onDoubleClick={() => {}}
        >
          <NodeConnectors />
          
          {hasContent && (
            <div className="absolute top-1 right-1 text-gray-500">
              <FileText className="h-4 w-4" />
            </div>
          )}

          <div className="w-full h-full flex items-center justify-center">
            <NodeLabel
              label={nodeData.label}
              fontSize={fontSize}
              fontFamily={nodeData.fontFamily}
              isEditing={false}
              onLabelChange={() => {}}
              onBlur={() => {}}
              onKeyDown={() => {}}
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
