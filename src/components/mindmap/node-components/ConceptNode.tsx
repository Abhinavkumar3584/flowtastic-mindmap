
import React from 'react';
import { Lightbulb } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { useRightPanel } from '@/utils/rightPanelManager';

export const ConceptNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const openPanel = useRightPanel((state) => state.openPanel);
  
  const handleDoubleClick = () => {
    openPanel(id, 'concept');
  };

  // Concept data
  const conceptType = data.conceptType || 'idea';
  const keywords = data.conceptKeywords || [];
  const hasBulb = data.showBulbIcon !== false;

  // Concept type styles
  const getConceptStyle = () => {
    switch(conceptType) {
      case 'theory': return 'bg-blue-50 border-blue-200';
      case 'principle': return 'bg-purple-50 border-purple-200';
      case 'method': return 'bg-green-50 border-green-200';
      default: return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <NodeContainer 
      nodeStyle={`min-w-[220px] min-h-[100px] rounded-md border-2 ${getConceptStyle()}`}
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
      forceAspectRatio={false}
    >
      <div className="w-full h-full p-3 flex flex-col">
        {/* Concept header */}
        <div className="flex items-center mb-2">
          {hasBulb && <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />}
          <div className="font-medium text-sm">{data.label || 'Concept'}</div>
        </div>
        
        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {keywords.map((keyword, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 text-xs bg-white bg-opacity-50 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
        
        {/* Description preview */}
        {data.conceptDescription && (
          <div className="mt-2 text-xs text-gray-600 line-clamp-2 overflow-hidden">
            {data.conceptDescription}
          </div>
        )}
      </div>
    </NodeContainer>
  );
};
