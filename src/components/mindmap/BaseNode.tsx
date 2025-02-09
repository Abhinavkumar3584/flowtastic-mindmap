
import { NodeContainer } from './node-components/NodeContainer';
import { NodeConnectors } from './NodeConnectors';
import { MindMapNodeProps, FontSize } from './types';
import { FileText } from 'lucide-react';
import { NodeLabel } from './node-components/NodeLabel';

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
  if (!data) return null;

  const hasContent = !!(data.content?.title || data.content?.description || (data.content?.links && data.content.links.length > 0));
  const nodeStyle = getNodeStyle(data.nodeType);
  const fontSize = getFontSize(data.fontSize as FontSize);

  return (
    <NodeContainer
      nodeStyle={nodeStyle}
      nodeData={data}
      selected={selected}
    >
      <NodeConnectors />
      
      {hasContent && (
        <div className="absolute top-1 right-1 text-gray-500">
          <FileText className="h-4 w-4" />
        </div>
      )}

      <div className="w-full h-full flex items-center justify-center">
        <NodeLabel
          label={data.label}
          fontSize={fontSize}
          fontFamily={data.fontFamily}
        />
      </div>
    </NodeContainer>
  );
};
