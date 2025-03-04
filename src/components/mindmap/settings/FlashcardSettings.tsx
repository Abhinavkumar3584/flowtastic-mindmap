
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseNodeData } from '../types';
import { PlusCircle, Trash2, Edit, Save, X, ChevronDown, ChevronUp } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Status = 'new' | 'learning' | 'review' | 'mastered';

interface FlashcardType {
  id: string;
  question: string;
  answer: string;
  category?: string;
  difficulty?: Difficulty;
  status?: Status;
}

interface FlashcardSettingsProps {
  nodeId: string | null;
  data: BaseNodeData;
}

export const FlashcardSettings = ({ nodeId, data }: FlashcardSettingsProps) => {
  const [flashcards, setFlashcards] = useState<FlashcardType[]>(data.flashcards || []);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedCard, setEditedCard] = useState<FlashcardType | null>(null);
  const [newCard, setNewCard] = useState<{
    question: string;
    answer: string;
    category: string;
    difficulty: Difficulty;
  }>({
    question: '',
    answer: '',
    category: '',
    difficulty: 'medium'
  });

  useEffect(() => {
    if (data.flashcards) {
      // Ensure all flashcards have the proper type for difficulty and status
      const typedFlashcards = data.flashcards.map(card => ({
        ...card,
        difficulty: (card.difficulty || 'medium') as Difficulty,
        status: (card.status || 'new') as Status
      }));
      setFlashcards(typedFlashcards);
    }
  }, [data.flashcards]);

  const handleUpdateNodeData = (updates: Partial<BaseNodeData>) => {
    if (nodeId) {
      window.mindmapApi?.updateNodeData(nodeId, updates);
    }
  };

  const handleAddFlashcard = () => {
    if (!newCard.question || !newCard.answer) return;
    
    const newFlashcard: FlashcardType = {
      id: uuidv4(),
      question: newCard.question,
      answer: newCard.answer,
      category: newCard.category || undefined,
      difficulty: newCard.difficulty,
      status: 'new'
    };
    
    const updatedFlashcards = [...flashcards, newFlashcard];
    setFlashcards(updatedFlashcards);
    handleUpdateNodeData({ flashcards: updatedFlashcards });
    setNewCard({ question: '', answer: '', category: '', difficulty: 'medium' });
  };

  const handleRemoveFlashcard = (id: string) => {
    const updatedFlashcards = flashcards.filter(card => card.id !== id);
    setFlashcards(updatedFlashcards);
    handleUpdateNodeData({ flashcards: updatedFlashcards });
  };

  const handleEditFlashcard = (card: FlashcardType) => {
    setEditMode(card.id);
    setEditedCard({ ...card });
  };

  const handleSaveEdit = () => {
    if (!editedCard) return;
    
    const updatedFlashcards = flashcards.map(card => 
      card.id === editedCard.id ? {
        ...editedCard,
        difficulty: editedCard.difficulty as Difficulty,
        status: editedCard.status as Status
      } : card
    );
    
    setFlashcards(updatedFlashcards);
    handleUpdateNodeData({ flashcards: updatedFlashcards });
    setEditMode(null);
    setEditedCard(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedCard(null);
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === flashcards.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedFlashcards = [...flashcards];
    const temp = updatedFlashcards[index];
    updatedFlashcards[index] = updatedFlashcards[newIndex];
    updatedFlashcards[newIndex] = temp;

    setFlashcards(updatedFlashcards);
    handleUpdateNodeData({ flashcards: updatedFlashcards });
  };

  return (
    <div>
      <Tabs defaultValue="flashcards">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="space-y-4 mt-4">
          {flashcards.length === 0 ? (
            <div className="text-center p-4 border rounded-md">
              <p className="text-muted-foreground">No flashcards yet. Add some to get started.</p>
            </div>
          ) : (
            flashcards.map((card, index) => (
              <Card key={card.id} className="mb-4 relative">
                {editMode === card.id ? (
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Textarea 
                        value={editedCard?.question || ''} 
                        onChange={(e) => setEditedCard(prev => prev ? {...prev, question: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer</Label>
                      <Textarea 
                        value={editedCard?.answer || ''} 
                        onChange={(e) => setEditedCard(prev => prev ? {...prev, answer: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input 
                        value={editedCard?.category || ''} 
                        onChange={(e) => setEditedCard(prev => prev ? {...prev, category: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select 
                        value={editedCard?.difficulty || 'medium'} 
                        onValueChange={(value) => setEditedCard(prev => 
                          prev ? {...prev, difficulty: value as Difficulty} : null
                        )}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={editedCard?.status || 'new'} 
                        onValueChange={(value) => setEditedCard(prev => 
                          prev ? {...prev, status: value as Status} : null
                        )}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="learning">Learning</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="mastered">Mastered</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSaveEdit} className="flex-1">
                        <Save className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{card.question}</CardTitle>
                          {card.category && (
                            <CardDescription>Category: {card.category}</CardDescription>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleMoveCard(index, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleMoveCard(index, 'down')}
                            disabled={index === flashcards.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{card.answer}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          card.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {card.difficulty || 'medium'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          card.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          card.status === 'learning' ? 'bg-purple-100 text-purple-800' :
                          card.status === 'review' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {card.status || 'new'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditFlashcard(card)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveFlashcard(card.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="add" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Flashcard</CardTitle>
              <CardDescription>Create a new flashcard for your study set</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea 
                  id="question"
                  placeholder="Enter your question" 
                  value={newCard.question}
                  onChange={(e) => setNewCard({...newCard, question: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea 
                  id="answer"
                  placeholder="Enter the answer" 
                  value={newCard.answer}
                  onChange={(e) => setNewCard({...newCard, answer: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Input 
                    id="category"
                    placeholder="E.g., History, Math, etc." 
                    value={newCard.category}
                    onChange={(e) => setNewCard({...newCard, category: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select 
                    value={newCard.difficulty} 
                    onValueChange={(value) => setNewCard({...newCard, difficulty: value as Difficulty})}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAddFlashcard} 
                disabled={!newCard.question || !newCard.answer}
                className="w-full"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Flashcard
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
