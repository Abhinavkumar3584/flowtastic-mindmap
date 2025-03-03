
import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Settings } from 'lucide-react';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShapeSettings } from '../settings/ShapeSettings';

export const RectangleNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  // Calculate styles with rotation
  const rotationStyle = {
    transform: data.rotation ? `rotate(${data.rotation}deg)` : 'none',
    backgroundColor: data.backgroundColor || 'white',
    borderColor: data.strokeColor || 'black',
    borderWidth: data.strokeWidth !== undefined ? `${data.strokeWidth}px` : '1px',
    borderStyle: data.strokeStyle || 'solid',
    opacity: data.opacity || 1,
    boxShadow: data.shadow?.enabled 
      ? `${data.shadow.offsetX || 3}px ${data.shadow.offsetY || 3}px ${data.shadow.blur || 5}px ${data.shadow.color || 'rgba(0,0,0,0.3)'}`
      : 'none',
    fontFamily: data.fontFamily || 'sans-serif',
    fontSize: data.fontSize === 'xs' ? '0.75rem' : 
              data.fontSize === 's' ? '0.875rem' : 
              data.fontSize === 'l' ? '1.25rem' : 
              data.fontSize === 'xl' ? '1.5rem' : '1rem',
    // Add a glow effect if enabled
    filter: data.glow?.enabled 
      ? `drop-shadow(0 0 ${data.glow.blur || 8}px ${data.glow.color || '#9b87f5'})` 
      : 'none',
    zIndex: data.zIndex || 0,
    aspectRatio: data.aspectRatio ? '1.8 / 1' : 'auto',
  };

  return (
    <div 
      className="relative"
      style={{ zIndex: data.zIndex || 0 }}
    >
      <div className={`min-w-[150px] min-h-[80px] flex items-center justify-center`}>
        <NodeResizer 
          minWidth={100}
          minHeight={50}
          isVisible={selected}
          lineClassName="border-mindmap-primary"
          handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
          keepAspectRatio={data.aspectRatio || false}
        />
        
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
        
        <div 
          className="w-full h-full flex items-center justify-center relative"
          style={rotationStyle}
        >
          <div 
            className="text-center w-full h-full flex items-center justify-center p-2"
            style={{ textAlign: data.textAlign || 'center' }}
          >
            {data.label || 'Rectangle'}
          </div>
          
          {/* Settings button in top right corner */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-white/70 hover:bg-white/90 z-10"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <ShapeSettings nodeId={id} data={data} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
