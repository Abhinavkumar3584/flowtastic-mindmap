
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
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

  return (
    <div className="relative">
      <NodeContainer 
        nodeStyle="min-w-[100px] min-h-[100px] flex items-center justify-center overflow-visible"
        nodeData={{...data, backgroundColor: 'transparent', strokeWidth: 0}}
        selected={selected}
        onDoubleClick={handleDoubleClick}
      >
        <div 
          className="triangle absolute top-0 left-0 w-full h-full"
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            backgroundColor: data.backgroundColor || '#fff',
            border: data.strokeWidth ? `${data.strokeWidth}px ${data.strokeStyle || 'solid'} ${data.strokeColor || '#000'}` : 'none',
          }}
        />
        
        <Handle type="target" position={Position.Top} style={{top: '0%'}} />
        <Handle type="source" position={Position.Bottom} style={{bottom: '0%'}} />
        <Handle type="target" position={Position.Left} style={{left: '25%'}} />
        <Handle type="source" position={Position.Right} style={{right: '25%'}} />
        
        <div className="w-full h-full p-2 flex items-center justify-center relative z-10">
          <div className="text-center">{data.label || 'Triangle'}</div>
          
          {/* Settings button in top right corner */}
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
      </NodeContainer>
    </div>
  );
};
