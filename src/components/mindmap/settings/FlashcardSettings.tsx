
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from 'lucide-react';
import { BaseNodeData } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FlashcardSettingsProps {
  nodeId: string;
  data: BaseNodeData;
}

export const FlashcardSettings: React.FC<FlashcardSettingsProps> = ({ nodeId, data }) => {
  const [flashcards, setFlashcards] = useState(data.flashcards || [
    { id: '1', question: 'What is a mindmap?', answer: 'A visual diagram used to organize information', category: 'General', difficulty: 'easy' }
  ]);
  
  const handleAddCard = () => {
    const newCard = {
      id: uuidv4(),
      question: 'New question',
      answer: 'New answer',
      category: 'General',
      difficulty: 'medium' as const
    };
    
    const updatedCards = [...flashcards, newCard];
    setFlashcards(updatedCards);
    saveFlashcards(updatedCards);
  };
  
  const handleDeleteCard = (id: string) => {
    const updatedCards = flashcards.filter(card => card.id !== id);
    setFlashcards(updatedCards);
    saveFlashcards(updatedCards);
  };
  
  const handleUpdateCard = (id: string, field: string, value: string) => {
    const updatedCards = flashcards.map(card => {
      if (card.id === id) {
        return { ...card, [field]: value };
      }
      return card;
    });
    
    setFlashcards(updatedCards);
    saveFlashcards(updatedCards);
  };
  
  const saveFlashcards = (cards: typeof flashcards) => {
    window.mindmapApi?.updateNodeData(nodeId, { flashcards: cards });
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold">Flashcard Settings</h3>
        <p className="text-sm text-gray-500">Manage your flashcards for spaced repetition learning</p>
      </div>
      
      <div className="space-y-4">
        {flashcards.map((card, index) => (
          <div key={card.id} className="border rounded-md p-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Card #{index + 1}</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                onClick={() => handleDeleteCard(card.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor={`question-${card.id}`}>Question</Label>
                <Textarea 
                  id={`question-${card.id}`}
                  value={card.question}
                  onChange={(e) => handleUpdateCard(card.id, 'question', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor={`answer-${card.id}`}>Answer</Label>
                <Textarea 
                  id={`answer-${card.id}`}
                  value={card.answer}
                  onChange={(e) => handleUpdateCard(card.id, 'answer', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`category-${card.id}`}>Category</Label>
                  <Input 
                    id={`category-${card.id}`}
                    value={card.category || ''}
                    onChange={(e) => handleUpdateCard(card.id, 'category', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`difficulty-${card.id}`}>Difficulty</Label>
                  <Select 
                    value={card.difficulty || 'medium'}
                    onValueChange={(value) => handleUpdateCard(card.id, 'difficulty', value)}
                  >
                    <SelectTrigger id={`difficulty-${card.id}`}>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`status-${card.id}`}>Learning Status</Label>
                <Select 
                  value={card.status || 'new'}
                  onValueChange={(value) => handleUpdateCard(card.id, 'status', value)}
                >
                  <SelectTrigger id={`status-${card.id}`}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="mastered">Mastered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={handleAddCard}
          className="w-full flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </Button>
      </div>
    </div>
  );
};
