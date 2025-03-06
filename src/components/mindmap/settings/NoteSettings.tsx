
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BaseNodeData } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Tag, StickyNote } from 'lucide-react';

interface NoteSettingsProps {
  nodeId: string;
  data: BaseNodeData;
}

export const NoteSettings: React.FC<NoteSettingsProps> = ({ 
  nodeId, 
  data 
}) => {
  const [noteContent, setNoteContent] = useState(data.noteContent || '');
  const [noteBgColor, setNoteBgColor] = useState(data.noteBgColor || '#FFF9C4');
  const [noteTextColor, setNoteTextColor] = useState(data.noteTextColor || '#333333');
  const [notePinned, setNotePinned] = useState(data.notePinned || false);
  const [noteTags, setNoteTags] = useState<string[]>(data.noteTags || []);
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    if (window.mindmapApi) {
      window.mindmapApi.updateNodeData(nodeId, {
        noteContent,
        noteBgColor,
        noteTextColor,
        notePinned,
        noteTags
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !noteTags.includes(newTag.trim())) {
      setNoteTags([...noteTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setNoteTags(noteTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <StickyNote className="h-5 w-5 mr-2" />
        <h2 className="text-lg font-semibold">Note Settings</h2>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bgColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="bgColor"
                value={noteBgColor}
                onChange={(e) => setNoteBgColor(e.target.value)}
                className="w-12 h-8 p-0"
              />
              <Input 
                type="text"
                value={noteBgColor}
                onChange={(e) => setNoteBgColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="textColor"
                value={noteTextColor}
                onChange={(e) => setNoteTextColor(e.target.value)}
                className="w-12 h-8 p-0"
              />
              <Input 
                type="text"
                value={noteTextColor}
                onChange={(e) => setNoteTextColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="pinned"
            checked={notePinned}
            onCheckedChange={setNotePinned}
          />
          <Label htmlFor="pinned">Pin this note</Label>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Note Content</Label>
          <Textarea
            id="content"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="min-h-[150px]"
            placeholder="Add your notes here..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              onKeyDown={handleKeyDown}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {noteTags.map((tag) => (
              <div 
                key={tag} 
                className="flex items-center bg-slate-100 px-2 py-1 rounded text-xs"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {noteTags.length === 0 && (
              <div className="text-sm text-gray-500">No tags added</div>
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
