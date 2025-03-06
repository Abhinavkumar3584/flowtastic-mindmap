
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShapeSettings } from '../settings/ShapeSettings';

export const TriangleNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  // Apply rotation if specified
  const rotationStyle = data.rotation ? {
    transform: `rotate(${data.rotation}deg)`,
  } : {};
  
  // Apply shadow if enabled
  const shadowStyle = data.shadow?.enabled ? {
    boxShadow: `${data.shadow.offsetX || 2}px ${data.shadow.offsetY || 2}px ${data.shadow.blur || 4}px ${data.shadow.color || 'rgba(0,0,0,0.3)'}`,
  } : {};
  
  // Apply glow if enabled
  const glowStyle = data.glow?.enabled ? {
    filter: `drop-shadow(0 0 ${data.glow.blur || 8}px ${data.glow.color || '#3b82f6'})`,
  } : {};

  return (
    <div className="relative">
      <NodeContainer 
        nodeStyle="flex items-center justify-center overflow-visible"
        nodeData={{...data, backgroundColor: 'transparent', strokeWidth: 0}}
        selected={selected}
        onDoubleClick={handleDoubleClick}
        customStyle={{
          ...rotationStyle,
          aspectRatio: data.aspectRatio !== false ? '1 / 1' : 'auto',
        }}
        forceAspectRatio={data.aspectRatio !== false}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            backgroundColor: data.backgroundColor || '#fff',
            border: data.strokeWidth ? `${data.strokeWidth}px ${data.strokeStyle || 'solid'} ${data.strokeColor || '#000'}` : 'none',
            ...shadowStyle,
            ...glowStyle,
          }}
        />
        
        <div className="w-full h-full p-2 flex items-center justify-center relative z-10">
          <div className="text-center">{data.label || 'Triangle'}</div>
          
          {/* Settings button in top right corner - only visible when selected */}
          {selected && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-white/70 hover:bg-white/90 z-20"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <ShapeSettings nodeId={id} data={data} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </NodeContainer>
    </div>
  );
};
