
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShapeSettings } from '../settings/ShapeSettings';

export const CircleNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <NodeContainer 
      nodeStyle="min-w-[100px] min-h-[100px] rounded-full flex items-center justify-center"
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      
      <div className="w-full h-full p-2 flex items-center justify-center relative">
        <div className="text-center">{data.label || 'Circle'}</div>
        
        {/* Settings button in top right corner */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-white/70 hover:bg-white/90"
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
  );
};
