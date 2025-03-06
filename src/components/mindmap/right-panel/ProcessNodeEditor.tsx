
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ProcessStep {
  id: string;
  label: string;
  isCompleted: boolean;
  description?: string;
}

interface ProcessNodeEditorProps {
  nodeId: string;
}

export const ProcessNodeEditor: React.FC<ProcessNodeEditorProps> = ({ nodeId }) => {
  const { toast } = useToast();
  const [label, setLabel] = useState('');
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [processColor, setProcessColor] = useState('#3b82f6');

  // Load node data
  useEffect(() => {
    if (!window.mindmapApi) return;
    
    const nodes = document.querySelectorAll('.react-flow__node');
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.getAttribute('data-id') === nodeId) {
        const nodeData = JSON.parse(node.getAttribute('data-field-data') || '{}');
        setLabel(nodeData.label || '');
        setSteps(nodeData.processSteps || [
          { id: '1', label: 'Step 1', isCompleted: false },
          { id: '2', label: 'Step 2', isCompleted: false },
          { id: '3', label: 'Step 3', isCompleted: false }
        ]);
        setShowDescriptions(nodeData.showProcessDescriptions || false);
        setProcessColor(nodeData.processColor || '#3b82f6');
        break;
      }
    }
  }, [nodeId]);

  const handleSave = () => {
    if (!window.mindmapApi) return;
    
    window.mindmapApi.updateNodeData(nodeId, {
      label,
      processSteps: steps,
      showProcessDescriptions: showDescriptions,
      processColor
    });
    
    toast({
      title: "Changes saved",
      description: "Process node has been updated",
      duration: 2000,
    });
  };

  const addStep = () => {
    setSteps([
      ...steps, 
      { 
        id: uuidv4(), 
        label: `Step ${steps.length + 1}`, 
        isCompleted: false,
        description: ''
      }
    ]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const updateStep = (id: string, updates: Partial<ProcessStep>) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= steps.length) return;
    
    const newSteps = [...steps];
    const [removed] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, removed);
    setSteps(newSteps);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Process Title</Label>
        <Input 
          id="label" 
          value={label} 
          onChange={(e) => setLabel(e.target.value)} 
          placeholder="Enter process title"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Process Color</Label>
        <div className="flex gap-2">
          {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full ${processColor === color ? 'ring-2 ring-offset-2' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setProcessColor(color)}
            />
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="descriptions" 
          checked={showDescriptions} 
          onCheckedChange={setShowDescriptions}
        />
        <Label htmlFor="descriptions">Show step descriptions</Label>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Process Steps</Label>
          <Button variant="outline" size="sm" onClick={addStep}>
            <Plus className="h-4 w-4 mr-1" />
            Add Step
          </Button>
        </div>
        
        {steps.length === 0 ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No steps defined. Add your first step to get started.
          </div>
        ) : (
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={step.id} className="border rounded-md p-3 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <button 
                    className="cursor-move text-gray-400 hover:text-gray-600"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      // Note: In a real app, you'd implement drag-and-drop here
                    }}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  
                  <div className="flex-1">
                    <Input 
                      value={step.label} 
                      onChange={(e) => updateStep(step.id, { label: e.target.value })} 
                      placeholder={`Step ${index + 1}`}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => moveStep(index, index - 1)}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => moveStep(index, index + 1)}
                      disabled={index === steps.length - 1}
                    >
                      ↓
                    </button>
                    <button 
                      className="text-red-400 hover:text-red-600"
                      onClick={() => removeStep(step.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Switch 
                    id={`complete-${step.id}`} 
                    checked={step.isCompleted} 
                    onCheckedChange={(checked) => updateStep(step.id, { isCompleted: checked })}
                  />
                  <Label htmlFor={`complete-${step.id}`}>Mark as completed</Label>
                </div>
                
                {showDescriptions && (
                  <div>
                    <textarea
                      value={step.description || ''}
                      onChange={(e) => updateStep(step.id, { description: e.target.value })}
                      className="w-full min-h-[60px] border rounded-md p-2 text-sm"
                      placeholder="Optional step description..."
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button className="w-full" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
};
