
import React from 'react';
import { Flame, Check, ArrowRight } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { useRightPanel } from '@/utils/rightPanelManager';

export const ActionNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const openPanel = useRightPanel((state) => state.openPanel);
  
  const handleDoubleClick = () => {
    openPanel(id, 'action');
  };

  // Default status if none exists
  const status = data.actionStatus || 'pending';
  const priorityLevel = data.priorityLevel || 'medium';

  // Status colors
  const getStatusColor = () => {
    switch(status) {
      case 'completed': return 'bg-green-100 border-green-500';
      case 'in-progress': return 'bg-blue-100 border-blue-500';
      case 'pending': return 'bg-yellow-100 border-yellow-500';
      default: return 'bg-gray-100 border-gray-500';
    }
  };

  // Priority indicator
  const getPriorityIndicator = () => {
    switch(priorityLevel) {
      case 'high': return <Flame className="h-5 w-5 text-red-500" />;
      case 'medium': return <ArrowRight className="h-5 w-5 text-blue-500" />;
      case 'low': return null;
      default: return null;
    }
  };

  return (
    <NodeContainer 
      nodeStyle={`min-w-[180px] min-h-[80px] rounded-md ${getStatusColor()}`}
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
      forceAspectRatio={false}
    >
      <div className="w-full h-full p-3 flex flex-col">
        {/* Status indicator and priority */}
        <div className="flex justify-between items-center mb-2">
          {status === 'completed' && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" /> Done
            </span>
          )}
          {status === 'in-progress' && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              In Progress
            </span>
          )}
          <div className="ml-auto">
            {getPriorityIndicator()}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="font-medium text-sm">{data.label || 'Action Item'}</div>
          {data.dueDate && (
            <div className="mt-2 text-xs text-gray-500">
              Due: {new Date(data.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </NodeContainer>
  );
};
