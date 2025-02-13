
import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { NodeConnectors } from '../NodeConnectors';

const SectionNode = ({ data, selected }: MindMapNodeProps) => {
  return (
    <div 
      className="section-node" 
      style={{ 
        width: '100%', 
        height: '100%',
        minWidth: '200px',
        minHeight: '150px',
        position: 'relative'
      }}
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
        <div className="absolute top-2 left-2 text-sm font-medium text-gray-600">
          {data?.label || ''}
        </div>
      </NodeContainer>
      <NodeConnectors />
    </div>
  );
};

export default memo(SectionNode);
