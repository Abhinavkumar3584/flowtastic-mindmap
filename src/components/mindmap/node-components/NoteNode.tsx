
import React from 'react';
import { Bookmark } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { useRightPanel } from '@/utils/rightPanelManager';

export const NoteNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const openPanel = useRightPanel((state) => state.openPanel);
  
  const handleDoubleClick = () => {
    openPanel(id, 'note');
  };

  // Note category and color
  const category = data.noteCategory || 'general';
  const isPinned = data.isPinned || false;
  
  // Category styles
  const getCategoryStyle = () => {
    switch(category) {
      case 'idea': return 'bg-purple-50 border-l-4 border-l-purple-400';
      case 'question': return 'bg-blue-50 border-l-4 border-l-blue-400';
      case 'important': return 'bg-red-50 border-l-4 border-l-red-400';
      default: return 'bg-gray-50 border-l-4 border-l-gray-400';
    }
  };

  return (
    <NodeContainer 
      nodeStyle={`min-w-[200px] min-h-[120px] rounded-md shadow-sm ${getCategoryStyle()}`}
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
      forceAspectRatio={false}
    >
      <div className="w-full h-full p-3 flex flex-col relative">
        {/* Category indicator and pin */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium capitalize text-gray-500">
            {category}
          </span>
          {isPinned && (
            <Bookmark className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>
        
        {/* Title */}
        <div className="font-medium text-sm">{data.label || 'Note'}</div>
        
        {/* Content preview */}
        {data.noteContent && (
          <div className="mt-2 text-xs text-gray-600 line-clamp-3 overflow-hidden">
            {data.noteContent}
          </div>
        )}
      </div>
    </NodeContainer>
  );
};
