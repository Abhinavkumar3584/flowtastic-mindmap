import { ReactNode } from 'react';
import { NodeResizer } from '@xyflow/react';
import { BaseNodeData } from '../types';

interface NodeContainerProps {
  nodeStyle: string;
  nodeData: BaseNodeData;
  selected: boolean;
  isCircle: boolean;
  isDiamond: boolean;
  children: ReactNode;
  onDoubleClick: () => void;
}

export const NodeContainer = ({
  nodeStyle,
  nodeData,
  selected,
  isCircle,
  isDiamond,
  children,
  onDoubleClick,
}: NodeContainerProps) => {
  return (
    <div 
      className={`min-w-[100px] min-h-[100px] ${nodeStyle} 
                 flex items-center justify-center relative
                 ${nodeData.nodeType !== 'title' ? 'hover:border-mindmap-node-selected' : ''}`}
      style={{
        backgroundColor: nodeData.backgroundColor,
        borderColor: nodeData.strokeColor,
        borderWidth: nodeData.strokeWidth,
        borderStyle: nodeData.strokeStyle,
        opacity: nodeData.opacity || 1,
        textAlign: nodeData.textAlign || 'center',
        transform: isDiamond ? 'rotate(45deg)' : 'none',
        aspectRatio: isCircle ? '1 / 1' : 'auto',
        padding: '4px',
      }}
      onDoubleClick={onDoubleClick}
    >
      {nodeData.nodeType !== 'title' && (
        <NodeResizer 
          minWidth={100}
          minHeight={isCircle ? 100 : 40}
          isVisible={selected}
          lineClassName="border-mindmap-primary"
          handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
          keepAspectRatio={isCircle}
        />
      )}
      {children}
    </div>
  );
};