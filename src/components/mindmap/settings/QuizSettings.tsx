
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BaseNodeData } from '../types';
import { PlusCircle, Trash2, Edit, Save, X, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  explanation?: string;
  difficulty?: Difficulty;
}

interface QuizSettingsProps {
  nodeId: string | null;
  data: BaseNodeData;
}

export const QuizSettings = ({ nodeId, data }: QuizSettingsProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<QuizQuestion | null>(null);
  const [newQuestion, setNewQuestion] = useState<QuizQuestion>({
    id: '',
    text: '',
    options: [
      { id: uuidv4(), text: '', isCorrect: false },
      { id: uuidv4(), text: '', isCorrect: false }
    ],
    explanation: '',
    difficulty: 'medium'
  });
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(null);

  useEffect(() => {
    if (data.questions) {
      // Ensure all questions have the proper type for difficulty
      const typedQuestions: QuizQuestion[] = data.questions.map(q => ({
        ...q,
        difficulty: (q.difficulty || 'medium') as Difficulty
      }));
      setQuestions(typedQuestions);
    }
  }, [data.questions]);

  const handleUpdateNodeData = (updates: Partial<BaseNodeData>) => {
    if (nodeId) {
      window.mindmapApi?.updateNodeData(nodeId, updates);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text || !newQuestion.options.some(o => o.text)) return;
    
    // Ensure at least one option is marked as correct
    const hasCorrectAnswer = newQuestion.options.some(o => o.isCorrect);
    if (!hasCorrectAnswer && newQuestion.options.length > 0) {
      // If no correct answer, mark the first option as correct
      newQuestion.options[0].isCorrect = true;
    }
    
    const finalQuestion: QuizQuestion = {
      ...newQuestion,
      id: uuidv4()
    };
    
    const updatedQuestions = [...questions, finalQuestion];
    setQuestions(updatedQuestions);
    handleUpdateNodeData({ questions: updatedQuestions });
    
    // Reset form
    setNewQuestion({
      id: '',
      text: '',
      options: [
        { id: uuidv4(), text: '', isCorrect: false },
        { id: uuidv4(), text: '', isCorrect: false }
      ],
      explanation: '',
      difficulty: 'medium'
    });
  };

  const handleRemoveQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    handleUpdateNodeData({ questions: updatedQuestions });
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditMode(question.id);
    setEditedQuestion({ ...question });
  };

  const handleSaveEdit = () => {
    if (!editedQuestion) return;
    
    // Ensure at least one option is marked as correct
    const hasCorrectAnswer = editedQuestion.options.some(o => o.isCorrect);
    if (!hasCorrectAnswer && editedQuestion.options.length > 0) {
      // If no correct answer, mark the first option as correct
      const updatedOptions = [...editedQuestion.options];
      updatedOptions[0].isCorrect = true;
      setEditedQuestion({
        ...editedQuestion,
        options: updatedOptions
      });
    }
    
    const updatedQuestions = questions.map(q => 
      q.id === editedQuestion.id ? {
        ...editedQuestion,
        difficulty: editedQuestion.difficulty as Difficulty
      } : q
    );
    
    setQuestions(updatedQuestions);
    handleUpdateNodeData({ questions: updatedQuestions });
    setEditMode(null);
    setEditedQuestion(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditedQuestion(null);
  };

  const handleAddOption = (questionType: 'new' | 'edit') => {
    const newOption = { id: uuidv4(), text: '', isCorrect: false };
    
    if (questionType === 'new') {
      setNewQuestion({
        ...newQuestion,
        options: [...newQuestion.options, newOption]
      });
    } else if (editedQuestion) {
      setEditedQuestion({
        ...editedQuestion,
        options: [...editedQuestion.options, newOption]
      });
    }
  };

  const handleRemoveOption = (questionType: 'new' | 'edit', optionId: string) => {
    if (questionType === 'new') {
      if (newQuestion.options.length <= 2) return; // Maintain minimum of 2 options
      
      setNewQuestion({
        ...newQuestion,
        options: newQuestion.options.filter(o => o.id !== optionId)
      });
    } else if (editedQuestion) {
      if (editedQuestion.options.length <= 2) return; // Maintain minimum of 2 options
      
      setEditedQuestion({
        ...editedQuestion,
        options: editedQuestion.options.filter(o => o.id !== optionId)
      });
    }
  };

  const handleOptionChange = (
    questionType: 'new' | 'edit', 
    optionId: string, 
    field: 'text' | 'isCorrect', 
    value: string | boolean
  ) => {
    if (questionType === 'new') {
      setNewQuestion({
        ...newQuestion,
        options: newQuestion.options.map(o => 
          o.id === optionId ? { ...o, [field]: value } : o
        )
      });
    } else if (editedQuestion) {
      setEditedQuestion({
        ...editedQuestion,
        options: editedQuestion.options.map(o => 
          o.id === optionId ? { ...o, [field]: value } : o
        )
      });
    }
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedQuestions = [...questions];
    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[newIndex];
    updatedQuestions[newIndex] = temp;

    setQuestions(updatedQuestions);
    handleUpdateNodeData({ questions: updatedQuestions });
  };

  return (
    <div>
      <Tabs defaultValue="questions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4 mt-4">
          {questions.length === 0 ? (
            <div className="text-center p-4 border rounded-md">
              <p className="text-muted-foreground">No questions yet. Add some to create your quiz.</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <Card key={question.id} className="mb-4">
                {editMode === question.id ? (
                  <CardContent className="p-4 space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Textarea 
                        value={editedQuestion?.text || ''} 
                        onChange={(e) => setEditedQuestion(prev => prev ? {...prev, text: e.target.value} : null)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Options</Label>
                      {editedQuestion?.options.map((option, idx) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={option.isCorrect}
                              onCheckedChange={(checked) => 
                                handleOptionChange('edit', option.id, 'isCorrect', checked)
                              }
                            />
                            <span className="text-xs">Correct</span>
                          </div>
                          <Input 
                            value={option.text} 
                            onChange={(e) => 
                              handleOptionChange('edit', option.id, 'text', e.target.value)
                            }
                            className="flex-1"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveOption('edit', option.id)}
                            disabled={editedQuestion.options.length <= 2}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddOption('edit')}
                        className="w-full mt-2"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Option
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Explanation (Optional)</Label>
                      <Textarea 
                        value={editedQuestion?.explanation || ''} 
                        onChange={(e) => setEditedQuestion(prev => prev ? {...prev, explanation: e.target.value} : null)}
                        placeholder="Explain why the correct answer is correct"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select 
                        value={editedQuestion?.difficulty || 'medium'} 
                        onValueChange={(value) => setEditedQuestion(prev => 
                          prev ? {...prev, difficulty: value as Difficulty} : null
                        )}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
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
                  <Collapsible
                    open={openCollapsible === question.id}
                    onOpenChange={(open) => setOpenCollapsible(open ? question.id : null)}
                  >
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-start">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="p-0 h-auto flex items-start">
                            {openCollapsible === question.id ? 
                              <ChevronDown className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" /> : 
                              <ChevronRight className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            }
                            <div className="text-left">
                              <CardTitle className="text-lg">{question.text}</CardTitle>
                              <CardDescription>
                                {question.options.length} options • 
                                <span className={
                                  question.difficulty === 'easy' ? ' text-green-600' :
                                  question.difficulty === 'hard' ? ' text-red-600' :
                                  ' text-yellow-600'
                                }>
                                  {' '}{question.difficulty || 'medium'} difficulty
                                </span>
                              </CardDescription>
                            </div>
                          </Button>
                        </CollapsibleTrigger>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleMoveQuestion(index, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleMoveQuestion(index, 'down')}
                            disabled={index === questions.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="py-0">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Options:</Label>
                          <ul className="space-y-1 pl-5 list-disc">
                            {question.options.map((option) => (
                              <li 
                                key={option.id} 
                                className={option.isCorrect ? 'font-medium text-green-600' : ''}
                              >
                                {option.text} {option.isCorrect && '(correct)'}
                              </li>
                            ))}
                          </ul>
                          
                          {question.explanation && (
                            <div className="mt-4">
                              <Label className="text-sm font-medium">Explanation:</Label>
                              <p className="text-sm mt-1 italic">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end py-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRemoveQuestion(question.id)}>
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="add" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Question</CardTitle>
              <CardDescription>Create a new quiz question with multiple options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question-text">Question</Label>
                <Textarea 
                  id="question-text"
                  placeholder="Enter your question" 
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Options</Label>
                {newQuestion.options.map((option, idx) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={option.isCorrect}
                        onCheckedChange={(checked) => 
                          handleOptionChange('new', option.id, 'isCorrect', checked)
                        }
                      />
                      <span className="text-xs">Correct</span>
                    </div>
                    <Input 
                      value={option.text} 
                      onChange={(e) => 
                        handleOptionChange('new', option.id, 'text', e.target.value)
                      }
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveOption('new', option.id)}
                      disabled={newQuestion.options.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddOption('new')}
                  className="w-full mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Option
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea 
                  id="explanation"
                  placeholder="Explain why the correct answer is correct" 
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={newQuestion.difficulty} 
                  onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value as Difficulty})}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAddQuestion} 
                disabled={!newQuestion.text || newQuestion.options.some(o => !o.text)}
                className="w-full"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Question
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
