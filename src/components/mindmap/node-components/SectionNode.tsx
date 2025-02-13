
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
        keepAspectRatio={false}
        handleStyle={{ 
          width: '8px', 
          height: '8px', 
          backgroundColor: 'white',
          border: '2px solid var(--mindmap-primary)'
        }}
        lineStyle={{
          borderWidth: '1px',
          borderStyle: 'dashed',
          borderColor: 'var(--mindmap-primary)'
        }}
      >
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
      </NodeResizer>
      <NodeConnectors />
    </div>
  );
};

export default memo(SectionNode);
