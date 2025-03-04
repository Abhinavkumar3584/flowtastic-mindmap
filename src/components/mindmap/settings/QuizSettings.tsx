
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { BaseNodeData } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from "@/components/ui/checkbox";

interface QuizSettingsProps {
  nodeId: string;
  data: BaseNodeData;
}

export const QuizSettings: React.FC<QuizSettingsProps> = ({ nodeId, data }) => {
  const [questions, setQuestions] = useState(data.questions || [
    { 
      id: '1', 
      text: 'What is the main benefit of mind mapping?', 
      options: [
        { id: 'a', text: 'Visual organization of ideas', isCorrect: true },
        { id: 'b', text: 'Faster typing speed', isCorrect: false },
        { id: 'c', text: 'Reduced eye strain', isCorrect: false }
      ],
      explanation: 'Mind mapping helps visualize connections between ideas',
      difficulty: 'easy'
    }
  ]);
  
  const handleAddQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      text: 'New question',
      options: [
        { id: uuidv4(), text: 'Option 1', isCorrect: true },
        { id: uuidv4(), text: 'Option 2', isCorrect: false },
        { id: uuidv4(), text: 'Option 3', isCorrect: false }
      ],
      explanation: '',
      difficulty: 'medium' as const
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };
  
  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(question => question.id !== id);
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };
  
  const handleUpdateQuestion = (id: string, field: string, value: string) => {
    const updatedQuestions = questions.map(question => {
      if (question.id === id) {
        return { ...question, [field]: value };
      }
      return question;
    });
    
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };
  
  const handleAddOption = (questionId: string) => {
    const updatedQuestions = questions.map(question => {
      if (question.id === questionId) {
        return {
          ...question,
          options: [
            ...question.options,
            { id: uuidv4(), text: 'New option', isCorrect: false }
          ]
        };
      }
      return question;
    });
    
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };
  
  const handleDeleteOption = (questionId: string, optionId: string) => {
    const updatedQuestions = questions.map(question => {
      if (question.id === questionId) {
        return {
          ...question,
          options: question.options.filter(option => option.id !== optionId)
        };
      }
      return question;
    });
    
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };
  
  const handleUpdateOption = (questionId: string, optionId: string, field: string, value: any) => {
    const updatedQuestions = questions.map(question => {
      if (question.id === questionId) {
        return {
          ...question,
          options: question.options.map(option => {
            if (option.id === optionId) {
              return { ...option, [field]: value };
            }
            
            // If setting this option as correct, make other options incorrect
            if (field === 'isCorrect' && value === true) {
              return { ...option, isCorrect: option.id === optionId };
            }
            
            return option;
          })
        };
      }
      return question;
    });
    
    setQuestions(updatedQuestions);
    saveQuestions(updatedQuestions);
  };
  
  const saveQuestions = (updatedQuestions: typeof questions) => {
    window.mindmapApi?.updateNodeData(nodeId, { questions: updatedQuestions });
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold">Quiz Settings</h3>
        <p className="text-sm text-gray-500">Create and manage quiz questions</p>
      </div>
      
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="border rounded-md p-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Question #{index + 1}</div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                <Textarea 
                  id={`question-${question.id}`}
                  value={question.text}
                  onChange={(e) => handleUpdateQuestion(question.id, 'text', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div>
                <Label>Options</Label>
                <div className="space-y-2 mt-1">
                  {question.options.map(option => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Checkbox 
                        checked={option.isCorrect}
                        onCheckedChange={(checked) => handleUpdateOption(question.id, option.id, 'isCorrect', !!checked)}
                        className="h-4 w-4 mt-0"
                      />
                      <Input 
                        value={option.text}
                        onChange={(e) => handleUpdateOption(question.id, option.id, 'text', e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteOption(question.id, option.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddOption(question.id)}
                    className="flex items-center gap-1 mt-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Option
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`explanation-${question.id}`}>Explanation (Optional)</Label>
                <Textarea 
                  id={`explanation-${question.id}`}
                  value={question.explanation || ''}
                  onChange={(e) => handleUpdateQuestion(question.id, 'explanation', e.target.value)}
                  rows={2}
                  placeholder="Explain why the correct answer is right..."
                />
              </div>
              
              <div>
                <Label htmlFor={`difficulty-${question.id}`}>Difficulty</Label>
                <Select 
                  value={question.difficulty || 'medium'}
                  onValueChange={(value) => handleUpdateQuestion(question.id, 'difficulty', value)}
                >
                  <SelectTrigger id={`difficulty-${question.id}`}>
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
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={handleAddQuestion}
          className="w-full flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>
    </div>
  );
};
