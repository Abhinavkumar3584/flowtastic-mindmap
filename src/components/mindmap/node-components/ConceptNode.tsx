
import React, { useState } from 'react';
import { Lightbulb, BookOpen, BookmarkIcon } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConceptSettings } from '../settings/ConceptSettings';
import { Badge } from '@/components/ui/badge';

export const ConceptNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // Get properties with default fallbacks
  const conceptName = data.conceptName || 'New Concept';
  const definition = data.conceptDefinition || '';
  const examples = data.conceptExamples || [];
  const relatedTerms = data.conceptRelatedTerms || [];
  const importance = data.conceptImportance || 'medium';
  const bgColor = data.conceptBgColor || '#E3F2FD';
  
  // Get importance color
  const getImportanceColor = () => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <NodeContainer 
      nodeStyle={`min-w-[220px] min-h-[120px] ${expanded ? 'min-h-[220px]' : ''}`}
      nodeData={{...data, backgroundColor: bgColor, strokeColor: '#BBDEFB'}}
      selected={selected}
      onDoubleClick={() => setExpanded(!expanded)}
    >
      <div className="w-full h-full p-3 flex flex-col relative">
        {/* Concept header */}
        <div className="flex items-center mb-2">
          <Lightbulb className="h-4 w-4 mr-1 text-blue-600" />
          <div className="font-semibold text-sm">{data.label}</div>
          <Badge className={`ml-auto text-[8px] ${getImportanceColor()}`} variant="outline">
            {importance}
          </Badge>
        </div>
        
        {/* Concept body - collapsed or expanded */}
        <div className="text-xs overflow-auto">
          {expanded ? (
            <>
              {definition && (
                <div className="mb-2">
                  <div className="font-medium flex items-center">
                    <BookOpen className="h-3 w-3 mr-1 inline text-blue-600" />
                    Definition:
                  </div>
                  <div className="pl-4 text-gray-700">{definition}</div>
                </div>
              )}
              
              {examples.length > 0 && (
                <div className="mb-2">
                  <div className="font-medium">Examples:</div>
                  <ul className="pl-5 list-disc text-gray-700">
                    {examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {relatedTerms.length > 0 && (
                <div>
                  <div className="font-medium flex items-center">
                    <BookmarkIcon className="h-3 w-3 mr-1 inline text-blue-600" />
                    Related:
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {relatedTerms.map((term, index) => (
                      <span key={index} className="px-1.5 py-0.5 bg-white/50 rounded text-[8px] text-gray-700">
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-700 line-clamp-2">{definition}</div>
          )}
        </div>
        
        {!expanded && definition && definition.length > 60 && (
          <div className="text-[8px] text-blue-600 mt-1 cursor-pointer" onClick={() => setExpanded(true)}>
            Expand to see more...
          </div>
        )}
        
        {/* Toggle expand/collapse button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-1 right-1 h-5 w-5 p-0 rounded-full bg-white/70 hover:bg-white/90"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="sr-only">{expanded ? 'Collapse' : 'Expand'}</span>
          <span className="text-xs">{expanded ? '▲' : '▼'}</span>
        </Button>
        
        {/* Settings button - only visible when selected */}
        {selected && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-1 right-1 h-5 w-5 p-0 rounded-full bg-white/70 hover:bg-white/90"
              >
                <span className="sr-only">Edit Concept</span>
                <span className="text-xs">⚙️</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90%] max-h-[80vh] overflow-y-auto">
              <ConceptSettings nodeId={id} data={data} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </NodeContainer>
  );
};
