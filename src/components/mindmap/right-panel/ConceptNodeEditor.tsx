
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

interface ConceptNodeEditorProps {
  nodeId: string;
}

export const ConceptNodeEditor: React.FC<ConceptNodeEditorProps> = ({ nodeId }) => {
  const { toast } = useToast();
  const [label, setLabel] = useState('');
  const [type, setType] = useState<'idea' | 'theory' | 'principle' | 'method'>('idea');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [description, setDescription] = useState('');
  const [showBulb, setShowBulb] = useState(true);
  const [relatedConcepts, setRelatedConcepts] = useState<string[]>([]);
  const [newRelatedConcept, setNewRelatedConcept] = useState('');

  // Load node data
  useEffect(() => {
    if (!window.mindmapApi) return;
    
    const nodes = document.querySelectorAll('.react-flow__node');
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.getAttribute('data-id') === nodeId) {
        const nodeData = JSON.parse(node.getAttribute('data-field-data') || '{}');
        setLabel(nodeData.label || '');
        setType(nodeData.conceptType || 'idea');
        setKeywords(nodeData.conceptKeywords || []);
        setDescription(nodeData.conceptDescription || '');
        setShowBulb(nodeData.showBulbIcon !== false);
        setRelatedConcepts(nodeData.relatedConcepts || []);
        break;
      }
    }
  }, [nodeId]);

  const handleSave = () => {
    if (!window.mindmapApi) return;
    
    window.mindmapApi.updateNodeData(nodeId, {
      label,
      conceptType: type,
      conceptKeywords: keywords,
      conceptDescription: description,
      showBulbIcon: showBulb,
      relatedConcepts: relatedConcepts
    });
    
    toast({
      title: "Changes saved",
      description: "Concept node has been updated",
      duration: 2000,
    });
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };

  const addRelatedConcept = () => {
    if (newRelatedConcept.trim() && !relatedConcepts.includes(newRelatedConcept.trim())) {
      setRelatedConcepts([...relatedConcepts, newRelatedConcept.trim()]);
      setNewRelatedConcept('');
    }
  };

  const removeRelatedConcept = (index: number) => {
    const newRelatedConcepts = [...relatedConcepts];
    newRelatedConcepts.splice(index, 1);
    setRelatedConcepts(newRelatedConcepts);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Concept Title</Label>
        <Input 
          id="label" 
          value={label} 
          onChange={(e) => setLabel(e.target.value)} 
          placeholder="Enter concept title"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Concept Type</Label>
        <RadioGroup value={type} onValueChange={(value) => setType(value as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="idea" id="idea" />
            <Label htmlFor="idea">Idea</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="theory" id="theory" />
            <Label htmlFor="theory">Theory</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="principle" id="principle" />
            <Label htmlFor="principle">Principle</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="method" id="method" />
            <Label htmlFor="method">Method</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="bulb" 
          checked={showBulb} 
          onCheckedChange={setShowBulb}
        />
        <Label htmlFor="bulb">Show light bulb icon</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
          placeholder="Explain the concept..."
        />
      </div>
      
      <div className="space-y-2">
        <Label>Keywords</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {keywords.map((keyword, index) => (
            <div key={index} className="bg-blue-50 px-2 py-1 rounded-full text-xs flex items-center border border-blue-200">
              {keyword}
              <button 
                onClick={() => removeKeyword(index)} 
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input 
            value={newKeyword} 
            onChange={(e) => setNewKeyword(e.target.value)} 
            placeholder="Add a keyword" 
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
          />
          <Button variant="outline" onClick={addKeyword}>Add</Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Related Concepts</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {relatedConcepts.map((concept, index) => (
            <div key={index} className="bg-purple-50 px-2 py-1 rounded-full text-xs flex items-center border border-purple-200">
              {concept}
              <button 
                onClick={() => removeRelatedConcept(index)} 
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input 
            value={newRelatedConcept} 
            onChange={(e) => setNewRelatedConcept(e.target.value)} 
            placeholder="Add related concept" 
            onKeyPress={(e) => e.key === 'Enter' && addRelatedConcept()}
          />
          <Button variant="outline" onClick={addRelatedConcept}>Add</Button>
        </div>
      </div>
      
      <Button className="w-full" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
};
