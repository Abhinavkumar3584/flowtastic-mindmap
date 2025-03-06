
import React from 'react';
import { ImageIcon } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { useRightPanel } from '@/utils/rightPanelManager';

export const ImageNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const openPanel = useRightPanel((state) => state.openPanel);
  
  const handleDoubleClick = () => {
    openPanel(id, 'image');
  };

  // Image data
  const imageUrl = data.imageUrl || '';
  const caption = data.imageCaption || data.label || '';
  const hasBorder = data.imageBorder !== false;

  return (
    <NodeContainer 
      nodeStyle={`min-w-[200px] min-h-[150px] rounded-md overflow-hidden ${hasBorder ? 'border-2 border-gray-200' : ''}`}
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
      forceAspectRatio={true}
    >
      <div className="w-full h-full flex flex-col">
        {imageUrl ? (
          <div className="relative w-full h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <img 
                src={imageUrl} 
                alt={caption}
                className="w-full h-full object-cover"
              />
            </div>
            {caption && (
              <div className="bg-black/50 text-white p-2 text-xs text-center">
                {caption}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center text-gray-400">
              <ImageIcon className="h-12 w-12 mb-2" />
              <span className="text-xs">No Image</span>
            </div>
          </div>
        )}
      </div>
    </NodeContainer>
  );
};
