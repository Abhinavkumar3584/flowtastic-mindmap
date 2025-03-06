
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BaseNodeData } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Lightbulb, BookOpen, BookmarkIcon } from 'lucide-react';

interface ConceptSettingsProps {
  nodeId: string;
  data: BaseNodeData;
}

export const ConceptSettings: React.FC<ConceptSettingsProps> = ({ 
  nodeId, 
  data 
}) => {
  const [conceptName, setConceptName] = useState(data.conceptName || '');
  const [conceptDefinition, setConceptDefinition] = useState(data.conceptDefinition || '');
  const [conceptExamples, setConceptExamples] = useState<string[]>(data.conceptExamples || []);
  const [conceptRelatedTerms, setConceptRelatedTerms] = useState<string[]>(data.conceptRelatedTerms || []);
  const [conceptImportance, setConceptImportance] = useState<'low' | 'medium' | 'high'>(
    (data.conceptImportance as 'low' | 'medium' | 'high') || 'medium'
  );
  const [conceptBgColor, setConceptBgColor] = useState(data.conceptBgColor || '#E3F2FD');
  const [newExample, setNewExample] = useState('');
  const [newRelatedTerm, setNewRelatedTerm] = useState('');

  const handleSave = () => {
    if (window.mindmapApi) {
      window.mindmapApi.updateNodeData(nodeId, {
        conceptName,
        conceptDefinition,
        conceptExamples,
        conceptRelatedTerms,
        conceptImportance,
        conceptBgColor,
        label: conceptName
      });
    }
  };

  const addExample = () => {
    if (newExample.trim()) {
      setConceptExamples([...conceptExamples, newExample.trim()]);
      setNewExample('');
    }
  };

  const removeExample = (example: string) => {
    setConceptExamples(conceptExamples.filter(e => e !== example));
  };

  const addRelatedTerm = () => {
    if (newRelatedTerm.trim() && !conceptRelatedTerms.includes(newRelatedTerm.trim())) {
      setConceptRelatedTerms([...conceptRelatedTerms, newRelatedTerm.trim()]);
      setNewRelatedTerm('');
    }
  };

  const removeRelatedTerm = (term: string) => {
    setConceptRelatedTerms(conceptRelatedTerms.filter(t => t !== term));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
        <h2 className="text-lg font-semibold">Concept Settings</h2>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="conceptName">Concept Name</Label>
          <Input
            id="conceptName"
            value={conceptName}
            onChange={(e) => setConceptName(e.target.value)}
            placeholder="Name of the concept"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="importance">Importance</Label>
            <Select 
              value={conceptImportance} 
              onValueChange={(value) => setConceptImportance(value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger id="importance">
                <SelectValue placeholder="Select importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bgColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="bgColor"
                value={conceptBgColor}
                onChange={(e) => setConceptBgColor(e.target.value)}
                className="w-12 h-9 p-0"
              />
              <Input 
                type="text"
                value={conceptBgColor}
                onChange={(e) => setConceptBgColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1 text-blue-600" />
            <Label htmlFor="definition">Definition</Label>
          </div>
          <Textarea
            id="definition"
            value={conceptDefinition}
            onChange={(e) => setConceptDefinition(e.target.value)}
            className="min-h-[100px]"
            placeholder="Define the concept..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="examples">Examples</Label>
          <div className="flex gap-2">
            <Input
              id="examples"
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="Add example..."
              onKeyDown={(e) => e.key === 'Enter' && addExample()}
            />
            <Button type="button" onClick={addExample} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-1 mt-2">
            {conceptExamples.map((example, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded text-sm"
              >
                <span>{example}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => removeExample(example)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            {conceptExamples.length === 0 && (
              <div className="text-sm text-gray-500">No examples added</div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <BookmarkIcon className="h-4 w-4 mr-1 text-blue-600" />
            <Label htmlFor="relatedTerms">Related Terms</Label>
          </div>
          <div className="flex gap-2">
            <Input
              id="relatedTerms"
              value={newRelatedTerm}
              onChange={(e) => setNewRelatedTerm(e.target.value)}
              placeholder="Add related term..."
              onKeyDown={(e) => e.key === 'Enter' && addRelatedTerm()}
            />
            <Button type="button" onClick={addRelatedTerm} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {conceptRelatedTerms.map((term, index) => (
              <div 
                key={index} 
                className="flex items-center bg-slate-100 px-2 py-1 rounded text-xs"
              >
                {term}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeRelatedTerm(term)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {conceptRelatedTerms.length === 0 && (
              <div className="text-sm text-gray-500">No related terms added</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};
