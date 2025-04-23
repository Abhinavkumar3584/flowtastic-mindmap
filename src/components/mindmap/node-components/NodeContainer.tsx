
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
  // Extract styles from nodeData with fallbacks
  const backgroundColor = nodeData.backgroundColor || '#ffffff';
  const strokeColor = nodeData.strokeColor || '#d1d5db';
  const strokeWidth = nodeData.strokeWidth || 1;
  const strokeStyle = nodeData.strokeStyle || 'solid';
  const opacity = nodeData.opacity || 1;
  const textAlign = nodeData.textAlign || 'center';

  // Apply shadow if enabled
  const shadowStyle = nodeData.shadow?.enabled ? {
    boxShadow: `${nodeData.shadow.offsetX || 2}px ${nodeData.shadow.offsetY || 2}px ${nodeData.shadow.blur || 4}px ${nodeData.shadow.color || 'rgba(0,0,0,0.3)'}`,
  } : {};

  // Apply glow if enabled
  const glowStyle = nodeData.glow?.enabled ? {
    filter: `drop-shadow(0 0 ${nodeData.glow.blur || 8}px ${nodeData.glow.color || '#3b82f6'})`,
  } : {};

  // Combine all styles
  const combinedStyle: CSSProperties = {
    backgroundColor,
    borderColor: strokeColor,
    borderWidth: strokeWidth,
    borderStyle: strokeStyle as 'solid' | 'dashed' | 'dotted',
    opacity,
    textAlign: textAlign as 'left' | 'center' | 'right',
    padding: '4px',
    margin: '4px',
    width: nodeData.width ? (typeof nodeData.width === 'number' ? `${nodeData.width}px` : nodeData.width) : undefined,
    height: nodeData.height ? (typeof nodeData.height === 'number' ? `${nodeData.height}px` : nodeData.height) : undefined,
    ...shadowStyle,
    ...glowStyle,
    ...customStyle,
  };

  // Add rotation if specified
  if (nodeData.rotation) {
    combinedStyle.transform = `rotate(${nodeData.rotation}deg)`;
  }

  return (
    <div 
      className={`min-w-[100px] min-h-[40px] ${nodeStyle} 
                 flex items-center justify-center relative
                 transition-shadow duration-200 ease-in-out
                 ${nodeData.nodeType !== 'title' ? 'hover:border-mindmap-node-selected' : ''}`}
      style={combinedStyle}
      onDoubleClick={onDoubleClick}
    >
      {/* Add connectors to enable connections between nodes */}
      {showConnectors && <NodeConnectors />}
      
      {/* Show NodeResizer for all nodes with consistent behavior */}
      <NodeResizer 
        minWidth={100}
        minHeight={40}
        isVisible={selected}
        lineClassName="border-mindmap-primary"
        handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
        keepAspectRatio={forceAspectRatio}
      />
      {children}
    </div>
  );
};
