
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
    type: getNodeType(type),
    data: { 
      label: additionalData.label || getDefaultLabel(type),
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
      ...getTypeSpecificData(type),
      ...additionalData
    },
    position: additionalData.position || {
      x: Math.random() * 500,
      y: Math.random() * 500,
    },
  };

  setNodes((nds) => [...nds, newNode]);
};

// Helper function to determine the correct node type component
const getNodeType = (nodeType: string): string => {
  switch (nodeType) {
    case 'section':
      return 'section';
    case 'checklist':
      return 'checklist';
    case 'timeline':
      return 'timeline';
    case 'resource':
      return 'resource';
    default:
      return 'base';
  }
};

// Helper function to get a default label based on node type
const getDefaultLabel = (nodeType: string): string => {
  switch (nodeType) {
    case 'title':
      return 'Title';
    case 'topic':
      return 'Topic';
    case 'subtopic':
      return 'Sub Topic';
    case 'paragraph':
      return 'Paragraph';
    case 'section':
      return 'Section';
    case 'checklist':
      return 'Study Checklist';
    case 'timeline':
      return 'Study Timeline';
    case 'resource':
      return 'Study Resources';
    default:
      return nodeType.charAt(0).toUpperCase() + nodeType.slice(1);
  }
};

// Helper function to get type-specific default data
const getTypeSpecificData = (nodeType: string): Partial<BaseNodeData> => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  
  switch (nodeType) {
    case 'checklist':
      return {
        checklistItems: [
          { id: '1', text: 'Read chapter 1', isChecked: false, priority: 'high' },
          { id: '2', text: 'Complete practice problems', isChecked: false, priority: 'medium' },
          { id: '3', text: 'Review notes', isChecked: false, priority: 'low' }
        ]
      };
    case 'timeline':
      return {
        startDate: now.toISOString(),
        endDate: nextWeek.toISOString(),
        timelineEvents: [
          { id: '1', title: 'Start studying', date: now.toISOString(), isMilestone: true },
          { id: '2', title: 'Complete first review', date: new Date(now.getTime() + 3*24*60*60*1000).toISOString(), isMilestone: false },
          { id: '3', title: 'Exam day', date: nextWeek.toISOString(), isMilestone: true }
        ]
      };
    case 'resource':
      return {
        resources: [
          { id: '1', title: 'Course Textbook', url: 'https://example.com/textbook', type: 'pdf', rating: 5, tags: ['essential', 'reference'] },
          { id: '2', title: 'Tutorial Video', url: 'https://example.com/video', type: 'video', rating: 4, tags: ['helpful'] }
        ]
      };
    default:
      return {};
  }
};
