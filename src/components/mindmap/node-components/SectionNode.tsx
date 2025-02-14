
import { memo } from 'react';
import { NodeResizer, Handle, Position } from '@xyflow/react';
import { MindMapNodeProps } from '../types';
import { NodeSettings } from '../NodeSettings';

const SectionNode = ({ data, selected, id }: MindMapNodeProps) => {
  return (
    <>
      <NodeResizer 
        minWidth={100}
        minHeight={100}
        isVisible={selected}
        handleStyle={{
          width: '8px',
          height: '8px',
          background: '#fff',
          border: '2px solid black',
        }}
      />
      <div
        className="relative w-full h-full min-w-[100px] min-h-[100px]"
        style={{
          backgroundColor: 'transparent',
          border: `${data.strokeWidth || 2}px solid ${data.strokeColor || '#000000'}`,
          borderRadius: `${data.borderRadius || 0}px`,
        }}
      >
        <div className="absolute top-2 left-2 text-sm font-medium">
          {data.label || 'Section'}
        </div>
        {selected && <NodeSettings data={data} nodeId={id} />}
        <Handle 
          type="source"
          position={Position.Top}
          className="w-2 h-1 border-2 bg-white rounded-none"
        />
        <Handle 
          type="source"
          position={Position.Right}
          className="w-1 h-2 border-2 bg-white rounded-none"
        />
        <Handle 
          type="source"
          position={Position.Bottom}
          className="w-2 h-1 border-2 bg-white rounded-none"
        />
        <Handle 
          type="source"
          position={Position.Left}
          className="w-1 h-2 border-2 bg-white rounded-none"
        />
      </div>
    </>
  );
};

export default memo(SectionNode);
