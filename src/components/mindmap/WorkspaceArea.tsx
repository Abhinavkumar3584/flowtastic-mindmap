
import React from 'react';
import { WorkspaceSettings } from './types';

interface WorkspaceAreaProps {
  settings: WorkspaceSettings;
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export const WorkspaceArea: React.FC<WorkspaceAreaProps> = ({ settings, viewport }) => {
  // If viewport is not provided via props, render nothing
  if (!viewport || !settings.enabled || !settings.visible) {
    return null;
  }

  const { x, y, zoom } = viewport;
  
  // Calculate position and dimensions based on zoom level and pan
  const width = settings.width;
  const height = settings.height || window.innerHeight;
  
  // Center workspace in viewport
  const left = (window.innerWidth - width * zoom) / 2 - x;
  
  return (
    <div 
      className="absolute pointer-events-none border-2 border-dashed border-blue-300 bg-blue-50/20 z-0"
      style={{
        left: `${left}px`,
        top: '0px',
        width: `${width * zoom}px`,
        height: `${height * zoom}px`,
        transform: `scale(${1/zoom})`,
        transformOrigin: 'top left',
      }}
    >
      <div className="absolute top-2 left-2 bg-white/80 text-xs px-2 py-1 rounded shadow font-medium text-blue-500">
        Workspace Area
      </div>
    </div>
  );
};
