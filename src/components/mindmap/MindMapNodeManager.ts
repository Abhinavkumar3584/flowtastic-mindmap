
import { BaseNodeData } from './types';

export const addNode = (
  setNodes: React.Dispatch<React.SetStateAction<any[]>>,
  nodes: any[],
  type: BaseNodeData['nodeType'], 
  additionalData: Partial<BaseNodeData> = {}
) => {
  if (!type) return;
  
  const newNode = {
    id: `${nodes.length + 1}`,
    type: type === 'section' ? 'section' : 'base',
    data: { 
      label: additionalData.label || (type.charAt(0).toUpperCase() + type.slice(1)),
      nodeType: type,
      backgroundColor: additionalData.backgroundColor || 'white',
      strokeColor: additionalData.strokeColor || 'black',
      strokeWidth: additionalData.strokeWidth || 1,
      strokeStyle: additionalData.strokeStyle || 'solid',
      fontSize: additionalData.fontSize || 'xs',
      textAlign: additionalData.textAlign || 'center',
      opacity: additionalData.opacity || 1,
      hasCheckbox: additionalData.hasCheckbox || false,
      isChecked: additionalData.isChecked || false,
      ...additionalData
    },
    position: additionalData.position || {
      x: Math.random() * 500,
      y: Math.random() * 500,
    },
  };

  setNodes((nds) => [...nds, newNode]);
};
