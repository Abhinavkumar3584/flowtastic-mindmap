
import { ReactNode } from 'react';
import { BaseNodeData } from '../types';

interface NodeContainerProps {
  nodeStyle: string;
  nodeData: BaseNodeData;
  selected: boolean;
  children: ReactNode;
  onDoubleClick: () => void;
}

export const NodeContainer = ({
  nodeStyle,
  nodeData,
  selected,
  children,
  onDoubleClick,
}: NodeContainerProps) => {
  return (
    <div 
      className={`w-full h-full ${nodeStyle} 
                 flex items-center justify-center relative
                 ${nodeData.nodeType !== 'title' ? 'hover:border-mindmap-node-selected' : ''}`}
      style={{
        backgroundColor: nodeData.backgroundColor,
        borderColor: nodeData.strokeColor,
        borderWidth: nodeData.strokeWidth,
        borderStyle: nodeData.strokeStyle,
        opacity: nodeData.opacity || 1,
        textAlign: nodeData.textAlign || 'center',
        padding: '4px',
        position: 'relative',
        minWidth: '200px',
        minHeight: '150px'
      }}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </div>
  );
};
