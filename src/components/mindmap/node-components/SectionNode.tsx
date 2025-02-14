
import { memo } from 'react';
import { NodeResizer, Handle, Position } from '@xyflow/react';
import { MindMapNodeProps } from '../types';

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
          border: '2px solid #000',
        }}
      />
      <div
        className="relative w-full h-full min-w-[100px] min-h-[100px]"
        style={{
          backgroundColor: 'transparent',
          border: `${data.strokeWidth || 1}px solid ${data.strokeColor || '#000000'}`,
        }}
      >
        {selected && (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default memo(SectionNode);
