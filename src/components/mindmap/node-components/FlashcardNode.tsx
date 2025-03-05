
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FlashcardSettings } from '../settings/FlashcardSettings';

export const FlashcardNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Default flashcards if none exist
  const flashcards = data.flashcards || [
    { id: '1', question: 'What is a mindmap?', answer: 'A visual diagram used to organize information', category: 'General', difficulty: 'easy' as const },
    { id: '2', question: 'How do flashcards help learning?', answer: 'They use active recall to strengthen memory', category: 'Education', difficulty: 'medium' as const }
  ];
  
  // Get the first flashcard to display
  const currentFlashcard = flashcards[0];
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <NodeContainer 
      nodeStyle="min-w-[220px] min-h-[130px] bg-white"
      nodeData={data}
      selected={selected}
      onDoubleClick={handleFlip}
      forceAspectRatio={false}
    >
      <div className="w-full h-full p-2 relative">
        <div className="font-semibold text-sm mb-2">{data.label || 'Flashcards'}</div>
        
        {/* Settings button in top right corner - only visible when selected */}
        {selected && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-white/70 hover:bg-white/90"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <FlashcardSettings nodeId={id} data={data} />
            </DialogContent>
          </Dialog>
        )}
        
        {/* Flashcard display */}
        {currentFlashcard && (
          <div 
            className="border rounded p-3 bg-gray-50 min-h-[80px] cursor-pointer flex items-center justify-center text-center"
            onClick={handleFlip}
          >
            <div className="font-medium text-sm">
              {isFlipped ? currentFlashcard.answer : currentFlashcard.question}
            </div>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          <span>{isFlipped ? 'Answer' : 'Question'}</span>
          <span className="mx-1">•</span>
          <span>{flashcards.length} cards</span>
          {currentFlashcard?.difficulty && (
            <>
              <span className="mx-1">•</span>
              <span className={`
                ${currentFlashcard.difficulty === 'easy' ? 'text-green-500' : 
                  currentFlashcard.difficulty === 'medium' ? 'text-orange-500' : 'text-red-500'}
              `}>
                {currentFlashcard.difficulty}
              </span>
            </>
          )}
        </div>
      </div>
    </NodeContainer>
  );
};
