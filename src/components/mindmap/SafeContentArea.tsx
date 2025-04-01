
import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { WorkspaceConfig } from './types';

interface SafeContentAreaProps {
  workspace: WorkspaceConfig;
}

export const SafeContentArea: React.FC<SafeContentAreaProps> = ({ workspace }) => {
  const { getViewport } = useReactFlow();

  if (!workspace.visible || !workspace.enabled) {
    return null;
  }

  const { zoom } = getViewport();
  const borderWidth = 1 / zoom; // Adjusting border width for zoom level

  // Calculate dimensions for safe content area
  // Make it 80% of the total workspace width to leave 10% margin on each side
  const safeWidth = workspace.width * 0.8;
  const safeLeft = workspace.x + (workspace.width - safeWidth) / 2;
  
  // Calculate height based on viewport
  const viewportHeight = window.innerHeight * 2;
  const topPosition = -viewportHeight / 2;

  return (
    <div 
      className="safe-content-area pointer-events-none absolute"
      style={{
        left: safeLeft,
        top: topPosition,
        width: safeWidth,
        height: viewportHeight,
        border: `${borderWidth}px dotted #22c55e`,
        opacity: 0.4,
        zIndex: 999,
      }}
    >
      <div className="absolute top-28 left-1/2 transform -translate-x-1/2 bg-white/90 px-2 py-1 rounded shadow text-xs text-green-600">
        Safe Content Area
      </div>
    </div>
  );
};
