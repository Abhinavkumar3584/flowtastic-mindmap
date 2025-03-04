
import { ReactNode, CSSProperties } from 'react';
import { NodeResizer } from '@xyflow/react';
import { BaseNodeData } from '../types';
import { NodeConnectors } from '../NodeConnectors';

interface NodeContainerProps {
  nodeStyle: string;
  nodeData: BaseNodeData;
  selected: boolean;
  children: ReactNode;
  onDoubleClick: () => void;
  customStyle?: CSSProperties;
  forceAspectRatio?: boolean;
  showConnectors?: boolean;
}

export const NodeContainer = ({
  nodeStyle,
  nodeData,
  selected,
  children,
  onDoubleClick,
  customStyle = {},
  forceAspectRatio = false,
  showConnectors = true,
}: NodeContainerProps) => {
  return (
    <div 
      className={`min-w-[100px] min-h-[40px] ${nodeStyle} 
                 flex items-center justify-center relative
                 transition-shadow duration-200 ease-in-out
                 ${nodeData.nodeType !== 'title' ? 'hover:border-mindmap-node-selected' : ''}`}
      style={{
        backgroundColor: nodeData.backgroundColor,
        borderColor: nodeData.strokeColor,
        borderWidth: nodeData.strokeWidth,
        borderStyle: nodeData.strokeStyle,
        opacity: nodeData.opacity || 1,
        textAlign: nodeData.textAlign || 'center',
        padding: '4px',
        margin: '4px',
        ...customStyle
      }}
      onDoubleClick={onDoubleClick}
    >
      {/* Add 4-sided connectors to every node */}
      {showConnectors && <NodeConnectors />}
      
      {/* Show NodeResizer for all nodes except title */}
      {nodeData.nodeType !== 'title' && (
        <NodeResizer 
          minWidth={100}
          minHeight={40}
          isVisible={selected}
          lineClassName="border-mindmap-primary"
          handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
          keepAspectRatio={forceAspectRatio}
        />
      )}
      {children}
    </div>
  );
};
