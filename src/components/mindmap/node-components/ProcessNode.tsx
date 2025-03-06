
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { useRightPanel } from '@/utils/rightPanelManager';

export const ProcessNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const openPanel = useRightPanel((state) => state.openPanel);
  
  const handleDoubleClick = () => {
    openPanel(id, 'process');
  };

  // Process steps data
  const steps = data.processSteps || [
    { id: '1', label: 'Step 1', isCompleted: false },
    { id: '2', label: 'Step 2', isCompleted: false },
    { id: '3', label: 'Step 3', isCompleted: false }
  ];

  return (
    <NodeContainer 
      nodeStyle="min-w-[250px] min-h-[120px] rounded-md bg-white"
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
      forceAspectRatio={false}
    >
      <div className="w-full h-full p-3 flex flex-col">
        {/* Process title */}
        <div className="font-medium text-sm mb-3">{data.label || 'Process'}</div>
        
        {/* Process steps */}
        <div className="flex-1 flex flex-col justify-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                ${step.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {index + 1}
              </div>
              <div className="mx-2 flex-1">
                <div className={`text-xs ${step.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400 rotate-90 my-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </NodeContainer>
  );
};
