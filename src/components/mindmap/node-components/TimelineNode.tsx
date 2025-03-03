
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Calendar, Clock, Settings } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TimelineSettings } from '../settings/TimelineSettings';

export const TimelineNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  // Default timeline events if none exist
  const timelineEvents = data.timelineEvents || [
    { 
      id: '1', 
      title: 'Start', 
      date: new Date().toISOString(), 
      isMilestone: true,
      description: 'Begin studying',
      isCompleted: false
    },
    { 
      id: '2', 
      title: 'Finish', 
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
      isMilestone: true,
      description: 'Complete studying',
      isCompleted: false
    }
  ];
  
  // Sort events by date
  const sortedEvents = [...timelineEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Format date for display
  const formatEventDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <NodeContainer 
      nodeStyle="min-w-[250px] min-h-[120px] bg-white"
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
      <div className="w-full p-2 relative">
        <div className="font-semibold text-sm mb-2">{data.label || 'Timeline'}</div>
        
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
            <TimelineSettings nodeId={id} data={data} />
          </DialogContent>
        </Dialog>
        
        {/* Timeline visualization */}
        <div className="relative pt-1">
          <div className="h-1 w-full bg-gray-300 rounded-full mb-4 relative">
            {sortedEvents.map((event, index) => {
              const position = `${(index / (sortedEvents.length - 1 || 1)) * 100}%`;
              return (
                <div 
                  key={event.id}
                  className={`absolute h-3 w-3 rounded-full -mt-1 transform -translate-x-1/2 cursor-pointer
                            ${event.isCompleted ? 'bg-green-500' : event.isMilestone ? 'bg-red-500' : 'bg-blue-400'}`}
                  style={{ left: position, backgroundColor: event.color }}
                  title={event.title}
                />
              );
            })}
          </div>

          <div className="space-y-2">
            {sortedEvents.slice(0, 3).map(event => (
              <div key={event.id} className="flex items-start text-xs bg-gray-50 rounded p-1">
                <div className={`w-2 h-2 mt-1 mr-1 rounded-full flex-shrink-0 ${event.isCompleted ? 'bg-green-500' : 'bg-blue-400'}`} 
                     style={{ backgroundColor: event.color }}></div>
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatEventDate(event.date)}
                  </div>
                </div>
              </div>
            ))}
            
            {sortedEvents.length > 3 && (
              <div className="text-xs text-center text-gray-500">
                +{sortedEvents.length - 3} more events
              </div>
            )}
          </div>
        </div>
      </div>
    </NodeContainer>
  );
};
