
import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '../ui/button';
import { ChevronsLeft, ChevronsRight, Eye, EyeOff } from 'lucide-react';

interface WorkspaceAreaProps {
  width: number;
  visible: boolean;
  onWidthChange: (width: number) => void;
  onVisibilityChange: (visible: boolean) => void;
}

export const WorkspaceArea: React.FC<WorkspaceAreaProps> = ({
  width,
  visible,
  onWidthChange,
  onVisibilityChange
}) => {
  const { viewportInitialized, getViewport } = useReactFlow();
  
  const increaseWidth = () => {
    onWidthChange(width + 50);
  };
  
  const decreaseWidth = () => {
    if (width > 300) {
      onWidthChange(width - 50);
    }
  };
  
  const toggleVisibility = () => {
    onVisibilityChange(!visible);
  };

  if (!viewportInitialized) {
    return null;
  }

  const { x, y, zoom } = getViewport();
  
  // Calculate the coordinates of the workspace area
  const areaHeight = 5000; // Large enough to cover the canvas
  const halfWidth = width / 2;

  return (
    <>
      {visible && (
        <div 
          className="absolute pointer-events-none"
          style={{
            top: 0,
            left: `calc(50% - ${halfWidth * zoom}px)`,
            width: `${width * zoom}px`,
            height: '100%',
            border: '2px dashed rgba(99, 102, 241, 0.6)',
            zIndex: 5,
            transform: `translateX(${x}px)`,
          }}
        >
          <div 
            className="absolute top-2 left-0 right-0 text-center text-gray-500 bg-white/80 py-1 px-4 mx-auto w-max rounded-md"
            style={{ fontSize: `${14 * zoom}px` }}
          >
            Draw inside this area for best results (i.e. cleaner look and no zoom-in required)
          </div>
        </div>
      )}
      
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleVisibility} 
          title={visible ? "Hide workspace boundary" : "Show workspace boundary"}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        
        {visible && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={increaseWidth} 
              title="Increase workspace width"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={decreaseWidth} 
              title="Decrease workspace width"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </>
  );
};
