
import React, { useState } from 'react';
import { StickyNote, Tag } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NoteSettings } from '../settings/NoteSettings';

export const NoteNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  // Get properties with default fallbacks
  const content = data.noteContent || 'Add your notes here...';
  const bgColor = data.noteBgColor || '#FFF9C4';
  const textColor = data.noteTextColor || '#333333';
  const tags = data.noteTags || [];
  const isPinned = data.notePinned || false;

  // Truncate content for display if it's too long
  const displayContent = !showFullContent && content.length > 150 
    ? content.substring(0, 150) + '...' 
    : content;

  return (
    <NodeContainer 
      nodeStyle="min-w-[200px] min-h-[150px]"
      nodeData={{...data, backgroundColor: bgColor, strokeColor: '#E0E0E0'}}
      selected={selected}
      onDoubleClick={() => setShowFullContent(!showFullContent)}
    >
      <div className="w-full h-full p-3 flex flex-col relative">
        {/* Note header with icon */}
        <div className="flex items-center mb-2">
          <StickyNote className="h-4 w-4 mr-1" style={{ color: textColor }} />
          <div className="font-semibold text-sm" style={{ color: textColor }}>{data.label}</div>
          {isPinned && (
            <div className="ml-auto">
              <div className="w-2 h-2 bg-red-500 rounded-full" title="Pinned"></div>
            </div>
          )}
        </div>
        
        {/* Note content */}
        <div 
          className="flex-1 text-xs overflow-auto mb-2 whitespace-pre-wrap"
          style={{ color: textColor }}
          onClick={() => setShowFullContent(!showFullContent)}
        >
          {displayContent}
        </div>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {tags.map((tag, index) => (
              <div 
                key={index} 
                className="flex items-center px-1.5 py-0.5 rounded-full text-[8px] bg-white/50"
                style={{ color: textColor }}
              >
                <Tag className="h-2 w-2 mr-0.5" />
                {tag}
              </div>
            ))}
          </div>
        )}
        
        {/* Settings button - only visible when selected */}
        {selected && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-1 right-1 h-5 w-5 p-0 rounded-full bg-white/70 hover:bg-white/90"
              >
                <span className="sr-only">Edit Note</span>
                <span className="text-xs">⚙️</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] max-h-[80vh] overflow-y-auto">
              <NoteSettings nodeId={id} data={data} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </NodeContainer>
  );
};
