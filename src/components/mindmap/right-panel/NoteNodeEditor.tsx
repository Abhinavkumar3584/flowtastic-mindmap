
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface NoteNodeEditorProps {
  nodeId: string;
}

export const NoteNodeEditor: React.FC<NoteNodeEditorProps> = ({ nodeId }) => {
  const { toast } = useToast();
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<'general' | 'idea' | 'question' | 'important'>('general');
  const [isPinned, setIsPinned] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Load node data
  useEffect(() => {
    if (!window.mindmapApi) return;
    
    const nodes = document.querySelectorAll('.react-flow__node');
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.getAttribute('data-id') === nodeId) {
        const nodeData = JSON.parse(node.getAttribute('data-field-data') || '{}');
        setLabel(nodeData.label || '');
        setCategory(nodeData.noteCategory || 'general');
        setIsPinned(nodeData.isPinned || false);
        setContent(nodeData.noteContent || '');
        setTags(nodeData.noteTags || []);
        break;
      }
    }
  }, [nodeId]);

  const handleSave = () => {
    if (!window.mindmapApi) return;
    
    window.mindmapApi.updateNodeData(nodeId, {
      label,
      noteCategory: category,
      isPinned,
      noteContent: content,
      noteTags: tags,
    });
    
    toast({
      title: "Changes saved",
      description: "Note has been updated",
      duration: 2000,
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Note Title</Label>
        <Input 
          id="label" 
          value={label} 
          onChange={(e) => setLabel(e.target.value)} 
          placeholder="Enter note title"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Category</Label>
        <RadioGroup value={category} onValueChange={(value) => setCategory(value as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general" id="general" />
            <Label htmlFor="general">General</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="idea" id="idea" />
            <Label htmlFor="idea">Idea</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="question" id="question" />
            <Label htmlFor="question">Question</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="important" id="important" />
            <Label htmlFor="important">Important</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="pin" 
          checked={isPinned} 
          onCheckedChange={setIsPinned}
        />
        <Label htmlFor="pin">Pin this note</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Note Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px]"
          placeholder="Enter your note here..."
        />
      </div>
      
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <div key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center">
              {tag}
              <button 
                onClick={() => removeTag(index)} 
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input 
            value={newTag} 
            onChange={(e) => setNewTag(e.target.value)} 
            placeholder="Add a tag" 
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <Button variant="outline" onClick={addTag}>Add</Button>
        </div>
      </div>
      
      <Button className="w-full" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
};
