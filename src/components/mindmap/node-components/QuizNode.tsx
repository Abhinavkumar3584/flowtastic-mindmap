
import React, { useState } from 'react';
import { Settings, CheckCircle, XCircle } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NodeConnectors } from '../NodeConnectors';
import { QuizSettings } from '../settings/QuizSettings';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const QuizNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // Default questions if none exist
  const questions = data.questions || [
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
  ];
  
  // Get the first question to display
  const currentQuestion = questions[0];
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  const handleCheckAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleReset = () => {
    setSelectedOption(null);
    setShowAnswer(false);
  };
  
  const getCorrectOption = () => {
    return currentQuestion?.options.find(option => option.isCorrect)?.id;
  };
  
  const isCorrect = selectedOption === getCorrectOption();

  return (
    <NodeContainer 
      nodeStyle="min-w-[250px] min-h-[150px] bg-white"
      nodeData={data}
      selected={selected}
      onDoubleClick={() => {}}
    >
      <NodeConnectors />
      
      <div className="w-full h-full p-2 relative">
        <div className="font-semibold text-sm mb-2">{data.label || 'Quiz'}</div>
        
        {/* Settings button in top right corner */}
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
            <QuizSettings nodeId={id} data={data} />
          </DialogContent>
        </Dialog>
        
        {/* Quiz display */}
        {currentQuestion && (
          <div className="border rounded p-2 bg-gray-50 text-left">
            <div className="font-medium text-xs mb-2">{currentQuestion.text}</div>
            
            <RadioGroup value={selectedOption || ""} className="space-y-1">
              {currentQuestion.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.id} 
                    id={`option-${option.id}`} 
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={showAnswer}
                    className="h-3 w-3"
                  />
                  <Label 
                    htmlFor={`option-${option.id}`} 
                    className={`text-xs ${showAnswer && option.isCorrect ? 'text-green-600 font-medium' : ''}`}
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {showAnswer && (
              <div className="mt-2 text-xs border-t pt-1">
                <div className="flex items-center gap-1">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-red-500" />
                      <span className="text-red-600">Incorrect</span>
                    </>
                  )}
                </div>
                {currentQuestion.explanation && (
                  <div className="text-gray-600 mt-1">{currentQuestion.explanation}</div>
                )}
              </div>
            )}
            
            <div className="flex justify-end mt-2 gap-1">
              {!showAnswer && selectedOption && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 text-xs py-0 px-2" 
                  onClick={handleCheckAnswer}
                >
                  Check
                </Button>
              )}
              
              {showAnswer && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 text-xs py-0 px-2" 
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-1 text-xs text-gray-500 text-center">
          <span>{questions.length} questions</span>
          {currentQuestion?.difficulty && (
            <>
              <span className="mx-1">•</span>
              <span className={`
                ${currentQuestion.difficulty === 'easy' ? 'text-green-500' : 
                  currentQuestion.difficulty === 'medium' ? 'text-orange-500' : 'text-red-500'}
              `}>
                {currentQuestion.difficulty}
              </span>
            </>
          )}
        </div>
      </div>
    </NodeContainer>
  );
};
