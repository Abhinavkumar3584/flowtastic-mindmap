
import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { Settings } from 'lucide-react';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShapeSettings } from '../settings/ShapeSettings';

export const TriangleNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  return (
    <div 
      className="relative"
      style={{ zIndex: data.zIndex || 0 }}
    >
      <div className={`min-w-[100px] min-h-[100px] flex items-center justify-center`}>
        <NodeResizer 
          minWidth={60}
          minHeight={60}
          isVisible={selected}
          lineClassName="border-mindmap-primary"
          handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
          keepAspectRatio={data.aspectRatio || false}
        />
        
        <Handle type="target" position={Position.Top} style={{top: '0%'}} />
        <Handle type="source" position={Position.Bottom} style={{bottom: '0%'}} />
        <Handle type="target" position={Position.Left} style={{left: '25%'}} />
        <Handle type="source" position={Position.Right} style={{right: '25%'}} />
        
        <div 
          className="w-full h-full relative"
          style={{
            transform: data.rotation ? `rotate(${data.rotation}deg)` : 'none',
            opacity: data.opacity || 1,
            zIndex: data.zIndex || 0,
          }}
        >
          {/* Triangle shape as a pseudo-element */}
          <div 
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              backgroundColor: data.backgroundColor || 'white',
              borderStyle: data.strokeStyle || 'solid',
              borderWidth: data.strokeWidth !== undefined ? `${data.strokeWidth}px` : '1px',
              borderColor: data.strokeColor || 'black',
              boxShadow: data.shadow?.enabled 
                ? `${data.shadow.offsetX || 3}px ${data.shadow.offsetY || 3}px ${data.shadow.blur || 5}px ${data.shadow.color || 'rgba(0,0,0,0.3)'}`
                : 'none',
              filter: data.glow?.enabled 
                ? `drop-shadow(0 0 ${data.glow.blur || 8}px ${data.glow.color || '#9b87f5'})` 
                : 'none',
            }}
          />
          
          {/* Text overlay */}
          <div 
            className="text-center absolute inset-0 flex items-center justify-center p-4 z-10"
            style={{ 
              textAlign: data.textAlign || 'center',
              fontFamily: data.fontFamily || 'sans-serif',
              fontSize: data.fontSize === 'xs' ? '0.75rem' : 
                      data.fontSize === 's' ? '0.875rem' : 
                      data.fontSize === 'l' ? '1.25rem' : 
                      data.fontSize === 'xl' ? '1.5rem' : '1rem',
            }}
          >
            {data.label || 'Triangle'}
          </div>
          
          {/* Settings button */}
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
        </div>
      </div>
    </div>
  );
};
