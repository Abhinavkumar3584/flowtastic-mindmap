
import React from 'react';
import { Settings } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NodeConnectors } from '../NodeConnectors';
import { MindMapSettings } from '../settings/MindMapSettings';
import { Handle, Position } from '@xyflow/react';

export const MindMapNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  // Default branches if none exist
  const branches = data.branches || [
    { id: '1', label: 'Main Idea', color: '#4299e1' },
    { id: '2', label: 'Sub-topic 1', color: '#48bb78' },
    { id: '3', label: 'Sub-topic 2', color: '#ed8936' }
  ];
  
  // Helper function to get angle for branch positioning
  const getBranchPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2; // Calculate angle in radians
    const radius = 45; // Radius from center point
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <NodeContainer 
      nodeStyle="min-w-[200px] min-h-[200px] bg-white rounded-full"
      nodeData={data}
      selected={selected}
      onDoubleClick={() => {}}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Right} />
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Bottom} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Left} />
      
      <div className="w-full h-full p-2 relative">
        {/* Settings button in top right corner - only visible when selected */}
        {selected && (
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
              <MindMapSettings nodeId={id} data={data} />
            </DialogContent>
          </Dialog>
        )}
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-semibold text-sm">{data.label || 'Mind Map'}</div>
        </div>
        
        {/* Branches radiating from center */}
        {branches.map((branch, index) => {
          const position = getBranchPosition(index, branches.length);
          return (
            <div 
              key={branch.id}
              className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm"
              style={{
                left: `calc(50% + ${position.x}px - 20px)`,
                top: `calc(50% + ${position.y}px - 20px)`,
                backgroundColor: branch.color || '#e2e8f0'
              }}
            >
              <div className="text-[8px] text-center text-white font-medium">
                {branch.label}
              </div>
            </div>
          );
        })}
        
        {/* Connect branches to center */}
        {branches.map((branch, index) => {
          const position = getBranchPosition(index, branches.length);
          const startX = 'calc(50%)';
          const startY = 'calc(50%)';
          const endX = `calc(50% + ${position.x}px)`;
          const endY = `calc(50% + ${position.y}px)`;
          
          return (
            <div 
              key={`line-${branch.id}`}
              className="absolute h-[1px] bg-gray-300 origin-center"
              style={{
                left: startX,
                top: startY,
                width: `${Math.sqrt(position.x * position.x + position.y * position.y)}px`,
                transform: `rotate(${Math.atan2(position.y, position.x)}rad)`,
                backgroundColor: branch.color || '#e2e8f0'
              }}
            />
          );
        })}
      </div>
    </NodeContainer>
  );
};
