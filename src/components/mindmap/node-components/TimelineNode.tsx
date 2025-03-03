
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { format } from 'date-fns';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';

export const TimelineNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Default timeline if none exists
  const timelineEvents = data.timelineEvents || [
    { id: '1', title: 'Start', date: new Date().toISOString(), isMilestone: true },
    { id: '2', title: 'Midpoint', date: new Date().toISOString(), isMilestone: false },
    { id: '3', title: 'Exam', date: new Date().toISOString(), isMilestone: true }
  ];
  
  // Sort events by date
  const sortedEvents = [...timelineEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <NodeContainer 
      nodeStyle="min-w-[250px] min-h-[150px] bg-white"
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
      <div className="w-full p-2">
        <div className="font-semibold text-sm mb-2">{data.label || 'Timeline'}</div>
        
        {/* Timeline visualization */}
        <div className="relative w-full h-[100px] border-l-2 border-gray-300 ml-4">
          {sortedEvents.map((event, index) => (
            <div 
              key={event.id}
              className="absolute flex items-center"
              style={{ 
                top: `${(index / (sortedEvents.length - 1 || 1)) * 100}%`,
                left: 0,
                transform: 'translateY(-50%)' 
              }}
            >
              <div 
                className={`w-3 h-3 rounded-full -ml-[7px] ${
                  event.isCompleted ? 'opacity-50' : ''
                }`}
                style={{ 
                  backgroundColor: event.color || (event.isMilestone ? '#ef4444' : '#3b82f6')
                }}
              ></div>
              <div className="ml-2">
                <div className={`text-xs font-medium ${event.isCompleted ? 'line-through text-gray-400' : ''}`}>
                  {event.title}
                </div>
                <div className="text-[10px] text-gray-500">{formatDate(event.date)}</div>
                {event.description && (
                  <div className="text-[10px] text-gray-600 max-w-[180px] truncate">{event.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {data.startDate && data.endDate && (
          <div className="text-xs text-gray-500 mt-2">
            {formatDate(data.startDate)} - {formatDate(data.endDate)}
          </div>
        )}
      </div>
    </NodeContainer>
  );
};
