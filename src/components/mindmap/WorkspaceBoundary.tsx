
import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { WorkspaceConfig } from './types';

interface WorkspaceBoundaryProps {
  workspace: WorkspaceConfig;
}

export const WorkspaceBoundary: React.FC<WorkspaceBoundaryProps> = ({ workspace }) => {
  const { getViewport } = useReactFlow();

  if (!workspace.visible || !workspace.enabled) {
    return null;
  }

  const { zoom } = getViewport();
  const borderWidth = 2 / zoom; // Adjusting border width for zoom level

  // Calculate height based on viewport
  const viewportHeight = window.innerHeight * 2; // Make it very tall to ensure it covers the entire canvas
  const topPosition = -viewportHeight / 2;

  return (
    <div 
      className="workspace-boundary pointer-events-none absolute"
      style={{
        left: workspace.x,
        top: topPosition,
        width: workspace.width,
        height: viewportHeight,
        border: `${borderWidth}px dashed #3b82f6`,
        opacity: 0.6,
        zIndex: 1000,
      }}
    >
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs">
        Export Area
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/90 px-2 py-1 rounded shadow text-xs text-blue-600">
        <span>↔</span>
        <span>{workspace.width}px</span>
      </div>
    </div>
  );
};
