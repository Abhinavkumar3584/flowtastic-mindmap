
import React, { useState } from 'react';
import { Settings, Clock, User } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { KanbanSettings } from '../settings/KanbanSettings';

export const KanbanNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  // Default kanban data if none exists
  const columns = data.columns || [
    {
      id: 'col1',
      title: 'To Do',
      cards: [
        { id: 'card1', content: 'Task 1', priority: 'medium' as const },
        { id: 'card2', content: 'Task 2', priority: 'low' as const }
      ]
    },
    {
      id: 'col2',
      title: 'In Progress',
      cards: [
        { id: 'card3', content: 'Task 3', priority: 'high' as const }
      ]
    },
    {
      id: 'col3',
      title: 'Done',
      cards: [
        { id: 'card4', content: 'Task 4' }
      ]
    }
  ];
  
  // Helper function to get priority color
  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-l-red-500';
      case 'medium': return 'bg-yellow-100 border-l-yellow-500';
      case 'low': return 'bg-green-100 border-l-green-500';
      default: return 'bg-gray-100 border-l-gray-300';
    }
  };

  return (
    <NodeContainer 
      nodeStyle="min-w-[320px] min-h-[180px] bg-white"
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
      forceAspectRatio={false}
    >
      <div className="w-full h-full p-2 relative">
        <div className="font-semibold text-sm mb-2">{data.label || 'Kanban Board'}</div>
        
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
              <KanbanSettings nodeId={id} data={data} />
            </DialogContent>
          </Dialog>
        )}
        
        {/* Kanban board display */}
        <div className="flex gap-2 overflow-x-auto pb-2 max-h-[150px]">
          {columns.map(column => (
            <div 
              key={column.id} 
              className="flex-shrink-0 w-[140px] bg-gray-100 rounded p-1 flex flex-col"
            >
              <div className="text-xs font-medium bg-gray-200 rounded px-2 py-1 mb-1">
                {column.title}
              </div>
              <div className="space-y-1 overflow-y-auto">
                {column.cards.map(card => (
                  <div 
                    key={card.id} 
                    className={`text-xs p-1 rounded shadow-sm border-l-2 ${getPriorityColor(card.priority)}`}
                  >
                    <div className="line-clamp-2">{card.content}</div>
                    <div className="flex items-center gap-1 mt-1 text-gray-500">
                      {card.assignee && (
                        <div className="flex items-center gap-0.5">
                          <User className="h-2.5 w-2.5" />
                          <span className="text-[9px]">{card.assignee}</span>
                        </div>
                      )}
                      {card.dueDate && (
                        <div className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          <span className="text-[9px]">{card.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </NodeContainer>
  );
};
