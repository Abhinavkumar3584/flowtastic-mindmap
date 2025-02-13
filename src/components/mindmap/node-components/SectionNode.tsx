
import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { NodeConnectors } from '../NodeConnectors';

const SectionNode = ({ data, selected }: MindMapNodeProps) => {
  return (
    <NodeContainer
      nodeStyle="border-2 rounded-lg"
      nodeData={{
        ...data,
        backgroundColor: 'transparent',
        strokeColor: '#000000',
        strokeWidth: 2,
        strokeStyle: 'solid'
      }}
      selected={selected}
      onDoubleClick={() => {}}
    >
      <NodeResizer 
        minWidth={200}
        minHeight={150}
        isVisible={selected}
        keepAspectRatio={false}
        handleStyle={{
          width: '8px',
          height: '8px',
          background: '#ffffff',
          border: '2px solid #000000',
          borderRadius: '2px'
        }}
        lineStyle={{
          border: '1px dashed #000000'
        }}
      />
      <div className="absolute top-2 left-2 text-sm font-medium text-gray-600">
        {data?.label || ''}
      </div>
      <NodeConnectors />
    </NodeContainer>
  );
};

export default memo(SectionNode);
