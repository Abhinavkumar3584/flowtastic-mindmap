
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ActionNodeEditorProps {
  nodeId: string;
}

export const ActionNodeEditor: React.FC<ActionNodeEditorProps> = ({ nodeId }) => {
  const { toast } = useToast();
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState('');
  const [dateOpen, setDateOpen] = useState(false);

  // Load node data
  useEffect(() => {
    if (!window.mindmapApi) return;
    
    const nodes = document.querySelectorAll('.react-flow__node');
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.getAttribute('data-id') === nodeId) {
        const nodeData = JSON.parse(node.getAttribute('data-field-data') || '{}');
        setLabel(nodeData.label || '');
        setStatus(nodeData.actionStatus || 'pending');
        setPriority(nodeData.priorityLevel || 'medium');
        setNotes(nodeData.actionNotes || '');
        
        if (nodeData.dueDate) {
          setDueDate(new Date(nodeData.dueDate));
        }
        break;
      }
    }
  }, [nodeId]);

  const handleSave = () => {
    if (!window.mindmapApi) return;
    
    window.mindmapApi.updateNodeData(nodeId, {
      label,
      actionStatus: status,
      priorityLevel: priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      actionNotes: notes,
    });
    
    toast({
      title: "Changes saved",
      description: "Action node has been updated",
      duration: 2000,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Action Title</Label>
        <Input 
          id="label" 
          value={label} 
          onChange={(e) => setLabel(e.target.value)} 
          placeholder="Enter action title"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Status</Label>
        <RadioGroup value={status} onValueChange={(value) => setStatus(value as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pending" id="pending" />
            <Label htmlFor="pending">Pending</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-progress" id="in-progress" />
            <Label htmlFor="in-progress">In Progress</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="completed" id="completed" />
            <Label htmlFor="completed">Completed</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Priority</Label>
        <RadioGroup value={priority} onValueChange={(value) => setPriority(value as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low">Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high">High</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Due Date</Label>
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {dueDate ? format(dueDate, 'PPP') : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate || undefined}
              onSelect={(date) => {
                setDueDate(date);
                setDateOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {dueDate && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDueDate(null)}
            className="text-xs text-muted-foreground"
          >
            Clear date
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full min-h-[100px] border rounded-md p-2"
          placeholder="Add notes about this action..."
        />
      </div>
      
      <Button className="w-full" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
};
