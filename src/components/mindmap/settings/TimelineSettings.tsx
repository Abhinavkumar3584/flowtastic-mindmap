
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Plus, Trash2, XCircle, Calendar as CalendarIcon2, CircleCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { BaseNodeData } from '../types';

interface TimelineSettingsProps {
  nodeId: string;
  data: BaseNodeData;
}

export const TimelineSettings: React.FC<TimelineSettingsProps> = ({ nodeId, data }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    data.startDate ? new Date(data.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    data.endDate ? new Date(data.endDate) : undefined
  );
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    isMilestone: false,
    color: '#4c86e0',
    description: '',
    isCompleted: false
  });
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const timelineEvents = data.timelineEvents || [];

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      window.mindmapApi?.updateNodeData(nodeId, { startDate: date.toISOString() });
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      window.mindmapApi?.updateNodeData(nodeId, { endDate: date.toISOString() });
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const updatedEvents = [
      ...timelineEvents,
      {
        id: uuidv4(),
        title: newEvent.title,
        date: new Date(newEvent.date).toISOString(),
        isMilestone: newEvent.isMilestone,
        color: newEvent.color,
        description: newEvent.description,
        isCompleted: newEvent.isCompleted
      }
    ];

    window.mindmapApi?.updateNodeData(nodeId, { timelineEvents: updatedEvents });
    setNewEvent({
      title: '',
      date: '',
      isMilestone: false,
      color: '#4c86e0',
      description: '',
      isCompleted: false
    });
  };

  const handleUpdateEvent = () => {
    if (!editingEventId || !newEvent.title || !newEvent.date) return;

    const updatedEvents = timelineEvents.map(event => 
      event.id === editingEventId ? {
        ...event,
        title: newEvent.title,
        date: new Date(newEvent.date).toISOString(),
        isMilestone: newEvent.isMilestone,
        color: newEvent.color,
        description: newEvent.description,
        isCompleted: newEvent.isCompleted
      } : event
    );

    window.mindmapApi?.updateNodeData(nodeId, { timelineEvents: updatedEvents });
    setEditingEventId(null);
    setNewEvent({
      title: '',
      date: '',
      isMilestone: false,
      color: '#4c86e0',
      description: '',
      isCompleted: false
    });
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = timelineEvents.filter(event => event.id !== id);
    window.mindmapApi?.updateNodeData(nodeId, { timelineEvents: updatedEvents });
    
    if (editingEventId === id) {
      setEditingEventId(null);
      setNewEvent({
        title: '',
        date: '',
        isMilestone: false,
        color: '#4c86e0',
        description: '',
        isCompleted: false
      });
    }
  };

  const handleEditEvent = (event: any) => {
    setEditingEventId(event.id);
    setNewEvent({
      title: event.title,
      date: new Date(event.date).toISOString().split('T')[0],
      isMilestone: event.isMilestone,
      color: event.color || '#4c86e0',
      description: event.description || '',
      isCompleted: event.isCompleted || false
    });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setNewEvent({
      title: '',
      date: '',
      isMilestone: false,
      color: '#4c86e0',
      description: '',
      isCompleted: false
    });
  };

  const handleToggleEventCompletion = (id: string) => {
    const updatedEvents = timelineEvents.map(event => 
      event.id === id ? { ...event, isCompleted: !event.isCompleted } : event
    );
    
    window.mindmapApi?.updateNodeData(nodeId, { timelineEvents: updatedEvents });
  };

  const formatDateForDisplay = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Timeline Settings</h3>
        
        {/* Timeline date range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-base font-medium">Timeline Events</h3>
        
        {/* Event list */}
        <div className="space-y-3 max-h-[240px] overflow-y-auto">
          {timelineEvents.map(event => (
            <div 
              key={event.id} 
              className={`p-3 border rounded-md relative ${
                event.isCompleted ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-2">
                  <div 
                    className={`w-4 h-4 rounded-full mt-1`}
                    style={{ backgroundColor: event.color || '#4c86e0' }}
                  ></div>
                  <div>
                    <div className="flex items-center">
                      <h4 className={`font-medium ${event.isCompleted ? 'line-through text-gray-500' : ''}`}>
                        {event.title}
                      </h4>
                      {event.isMilestone && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                          Milestone
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDateForDisplay(event.date)}
                    </p>
                    {event.description && (
                      <p className="text-xs mt-1">{event.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => handleToggleEventCompletion(event.id)}
                  >
                    <CircleCheck className={`h-4 w-4 ${event.isCompleted ? 'text-green-500' : 'text-gray-400'}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => handleEditEvent(event)}
                  >
                    <CalendarIcon2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-red-500" 
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {timelineEvents.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No events added yet. Create your first event below.
            </div>
          )}
        </div>
        
        {/* Add/Edit event form */}
        <div className="space-y-3 p-3 border rounded-md">
          <h4 className="text-sm font-medium">
            {editingEventId ? 'Edit Event' : 'Add New Event'}
          </h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={newEvent.title}
                onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Event title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                value={newEvent.date}
                onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-description">Description (optional)</Label>
              <Textarea
                id="event-description"
                value={newEvent.description}
                onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description"
                className="min-h-[60px]"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="event-color">Color</Label>
                <Input
                  id="event-color"
                  type="color"
                  value={newEvent.color}
                  onChange={e => setNewEvent(prev => ({ ...prev, color: e.target.value }))}
                  className="h-10 p-1 w-full"
                />
              </div>
              
              <div className="space-y-2 flex-1">
                <div className="flex items-start pt-8 space-x-2">
                  <Checkbox
                    id="is-milestone"
                    checked={newEvent.isMilestone}
                    onCheckedChange={(checked) => 
                      setNewEvent(prev => ({ ...prev, isMilestone: checked === true }))
                    }
                  />
                  <Label htmlFor="is-milestone" className="font-normal">Milestone</Label>
                </div>
              </div>
              
              <div className="space-y-2 flex-1">
                <div className="flex items-start pt-8 space-x-2">
                  <Checkbox
                    id="is-completed"
                    checked={newEvent.isCompleted}
                    onCheckedChange={(checked) => 
                      setNewEvent(prev => ({ ...prev, isCompleted: checked === true }))
                    }
                  />
                  <Label htmlFor="is-completed" className="font-normal">Completed</Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              {editingEventId ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateEvent}>
                    Update Event
                  </Button>
                </>
              ) : (
                <Button onClick={handleAddEvent}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Event
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
