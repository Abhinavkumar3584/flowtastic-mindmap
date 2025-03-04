
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from 'lucide-react';
import { BaseNodeData } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface MindMapSettingsProps {
  nodeId: string;
  data: BaseNodeData;
}

export const MindMapSettings: React.FC<MindMapSettingsProps> = ({ nodeId, data }) => {
  const [branches, setBranches] = useState(data.branches || [
    { id: '1', label: 'Main Idea', color: '#4299e1' },
    { id: '2', label: 'Sub-topic 1', color: '#48bb78' },
    { id: '3', label: 'Sub-topic 2', color: '#ed8936' }
  ]);
  
  const handleAddBranch = () => {
    const newBranch = {
      id: uuidv4(),
      label: 'New Branch',
      color: getRandomColor()
    };
    
    const updatedBranches = [...branches, newBranch];
    setBranches(updatedBranches);
    saveBranches(updatedBranches);
  };
  
  const handleDeleteBranch = (id: string) => {
    const updatedBranches = branches.filter(branch => branch.id !== id);
    setBranches(updatedBranches);
    saveBranches(updatedBranches);
  };
  
  const handleUpdateBranch = (id: string, field: string, value: string) => {
    const updatedBranches = branches.map(branch => {
      if (branch.id === id) {
        return { ...branch, [field]: value };
      }
      return branch;
    });
    
    setBranches(updatedBranches);
    saveBranches(updatedBranches);
  };
  
  const saveBranches = (updatedBranches: typeof branches) => {
    window.mindmapApi?.updateNodeData(nodeId, { branches: updatedBranches });
  };
  
  const getRandomColor = () => {
    const colors = [
      '#4299e1', // blue
      '#48bb78', // green
      '#ed8936', // orange
      '#9f7aea', // purple
      '#f56565', // red
      '#38b2ac', // teal
      '#ecc94b'  // yellow
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold">Mind Map Settings</h3>
        <p className="text-sm text-gray-500">Manage your mind map branches</p>
      </div>
      
      <div className="space-y-4">
        {branches.map((branch, index) => (
          <div key={branch.id} className="border rounded-md p-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Branch #{index + 1}</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                onClick={() => handleDeleteBranch(branch.id)}
                disabled={branches.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor={`label-${branch.id}`}>Label</Label>
                <Input 
                  id={`label-${branch.id}`}
                  value={branch.label}
                  onChange={(e) => handleUpdateBranch(branch.id, 'label', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`color-${branch.id}`}>Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id={`color-${branch.id}`}
                    type="color"
                    value={branch.color || '#4299e1'}
                    onChange={(e) => handleUpdateBranch(branch.id, 'color', e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input 
                    value={branch.color || '#4299e1'}
                    onChange={(e) => handleUpdateBranch(branch.id, 'color', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={handleAddBranch}
          className="w-full flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </Button>
      </div>
    </div>
  );
};
