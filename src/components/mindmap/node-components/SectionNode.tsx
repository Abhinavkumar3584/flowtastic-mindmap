
import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { NodeConnectors } from '../NodeConnectors';

const SectionNode = ({ data, selected }: MindMapNodeProps) => {
  return (
    <div className="relative min-w-[200px] min-h-[150px]">
      <NodeResizer 
        minWidth={200}
        minHeight={150}
        isVisible={selected}
        lineClassName="border-mindmap-primary"
        handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
      />
      <NodeContainer
        nodeStyle="border-2 rounded-lg bg-transparent"
        nodeData={data}
        selected={selected}
        onDoubleClick={() => {}}
      >
        <div className="absolute top-2 left-2 text-sm font-medium text-gray-600">
          {data.label}
        </div>
      </NodeContainer>
      <NodeConnectors />
    </div>
  );
};

export default memo(SectionNode);
