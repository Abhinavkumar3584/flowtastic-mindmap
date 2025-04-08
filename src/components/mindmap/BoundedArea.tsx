
import React from 'react';

interface BoundedAreaProps {
  width: number;  // Width in pixels
  height: number; // Height in pixels
}

export const BoundedArea: React.FC<BoundedAreaProps> = ({ width, height }) => {
  return (
    <div 
      className="absolute pointer-events-none"
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        border: '2px dashed rgba(99, 99, 99, 0.7)',
        borderRadius: '4px',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-sm text-gray-500 whitespace-nowrap shadow-sm">
        Content Boundary - Only content in this area will be exported
      </div>
      {/* Vertical lines to indicate the working area */}
      <div className="absolute top-0 left-1/4 h-full border-l border-dashed border-gray-400 opacity-30"></div>
      <div className="absolute top-0 right-1/4 h-full border-l border-dashed border-gray-400 opacity-30"></div>
    </div>
  );
};
