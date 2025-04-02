
import React from 'react';
import { WorkspaceSettings } from './types';

interface WorkspaceAreaProps {
  settings: WorkspaceSettings;
}

export const WorkspaceArea: React.FC<WorkspaceAreaProps> = ({ settings }) => {
  const { width, visible } = settings;
  
  if (!visible) return null;
  
  // Calculate the position to center the workspace
  const leftPosition = `calc(50% - ${width / 2}px)`;
  
  return (
    <div 
      className="workspace-area absolute h-full pointer-events-none"
      style={{
        left: leftPosition,
        width: `${width}px`,
        top: 0,
        bottom: 0,
        border: '2px dashed #6b7280',
        borderRadius: '8px',
        zIndex: -1
      }}
    >
      <div className="workspace-label absolute -top-8 left-0 right-0 text-center text-sm text-gray-500">
        Draw inside this area for best results (i.e. cleaner look and no zoom-in required)
      </div>
    </div>
  );
};
