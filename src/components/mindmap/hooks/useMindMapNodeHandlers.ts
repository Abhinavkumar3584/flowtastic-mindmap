
import { useCallback } from 'react';
import { Node, XYPosition } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { BaseNodeData, MindMapNode } from '../types';
import { WORKSPACE_WIDTH, WORKSPACE_PADDING } from '../WorkspaceConstants';

interface UseMindMapNodeHandlersProps {
  nodes: MindMapNode[];
  setNodes: React.Dispatch<React.SetStateAction<MindMapNode[]>>;
  workspaceWidth?: number;
}

export const useMindMapNodeHandlers = ({ 
  nodes, 
  setNodes,
  workspaceWidth = WORKSPACE_WIDTH
}: UseMindMapNodeHandlersProps) => {
  // Function to delete a node
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
  }, [setNodes]);

  // Function to update node data
  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<BaseNodeData>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Function to get node position within workspace
  const getPositionInWorkspace = useCallback(
    (position: XYPosition): XYPosition => {
      // Calculate center of workspace
      const workspaceCenter = workspaceWidth / 2;
      
      // Ensure the position is within the bounds of the workspace
      // with some padding for better visibility
      const x = Math.min(
        Math.max(position.x, WORKSPACE_PADDING),
        workspaceWidth - WORKSPACE_PADDING
      );

      return { x, y: position.y };
    },
    [workspaceWidth]
  );

  // Function to add a new node
  const addNode = useCallback(
    (type: string) => {
      const newNodeId = uuidv4();
      let nodeData: BaseNodeData = { 
        label: `New ${type}`,
        nodeType: type
      };
      
      // Set default position in the center of the workspace
      const position = getPositionInWorkspace({ 
        x: workspaceWidth / 2 - 75, // Center horizontally, accounting for node width
        y: 300 // Default vertical position 
      });

      // Create specific node types with their default data
      switch (type) {
        case 'title':
          nodeData = {
            ...nodeData,
            label: 'Main Title',
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center'
          };
          break;
        case 'topic':
          nodeData = {
            ...nodeData,
            label: 'Topic',
            fontSize: 18,
            fontWeight: 'semibold',
            backgroundColor: '#e2f0ff',
            strokeColor: '#90c5f9',
            strokeWidth: 2
          };
          break;
        case 'subtopic':
          nodeData = {
            ...nodeData,
            label: 'Subtopic',
            fontSize: 16,
            backgroundColor: '#f0f9ff',
            strokeColor: '#bde0fe'
          };
          break;
        case 'paragraph':
          nodeData = {
            ...nodeData,
            label: 'Text content goes here. Double-click to edit.',
            fontSize: 14,
            textAlign: 'left'
          };
          break;
        case 'section':
          nodeData = {
            ...nodeData,
            label: 'Section',
            backgroundColor: 'rgba(241, 245, 249, 0.7)', // Very light background
            borderRadius: 8,
            sections: []
          };
          break;
        case 'checklist':
          nodeData = {
            ...nodeData,
            label: 'Tasks',
            checklistItems: [
              { id: uuidv4(), text: 'Task 1', isChecked: false },
              { id: uuidv4(), text: 'Task 2', isChecked: false }
            ]
          };
          break;
        case 'timeline':
          nodeData = {
            ...nodeData,
            label: 'Timeline',
            timelineEvents: [
              { id: uuidv4(), title: 'Event 1', date: new Date().toISOString(), description: 'Description...' },
              { id: uuidv4(), title: 'Event 2', date: new Date().toISOString(), description: 'Description...' }
            ]
          };
          break;
        case 'resource':
          nodeData = {
            ...nodeData,
            label: 'Resources',
            content: {
              title: 'Resources',
              description: 'A collection of useful resources',
              links: [
                { label: 'Resource 1', url: 'https://example.com/1' },
                { label: 'Resource 2', url: 'https://example.com/2' }
              ]
            }
          };
          break;
        case 'circle':
        case 'rectangle':
        case 'square':
        case 'triangle':
          nodeData = {
            ...nodeData,
            label: type.charAt(0).toUpperCase() + type.slice(1),
            shapeType: type,
            backgroundColor: '#f0f9ff',
            strokeColor: '#90c5f9',
            strokeWidth: 2
          };
          break;
        case 'flashcard':
          nodeData = {
            ...nodeData,
            label: 'Flashcards',
            flashcards: [
              { id: uuidv4(), question: 'Question 1', answer: 'Answer 1' },
              { id: uuidv4(), question: 'Question 2', answer: 'Answer 2' }
            ]
          };
          break;
        case 'quiz':
          nodeData = {
            ...nodeData,
            label: 'Quiz',
            quizTitle: 'New Quiz',
            quizQuestions: [
              { 
                id: uuidv4(),
                question: 'Sample question?',
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                correctAnswer: 0
              }
            ]
          };
          break;
        case 'mindmap':
          nodeData = {
            ...nodeData,
            label: 'Nested Mind Map',
            mapItems: [
              { 
                id: uuidv4(),
                text: 'Central idea',
                children: [
                  { id: uuidv4(), text: 'Related concept 1', children: [] },
                  { id: uuidv4(), text: 'Related concept 2', children: [] }
                ]
              }
            ]
          };
          break;
        case 'note':
          nodeData = {
            ...nodeData,
            label: 'Note',
            noteContent: 'Write your notes here...',
            noteColor: '#fffacd', // Light yellow
            tags: ['note', 'important']
          };
          break;
        case 'concept':
          nodeData = {
            ...nodeData,
            label: 'Concept',
            definition: 'Define the concept here...',
            examples: ['Example 1', 'Example 2'],
            relatedConcepts: ['Related 1', 'Related 2']
          };
          break;
      }

      // Add the new node
      const newNode: MindMapNode = {
        id: newNodeId,
        type: type === 'title' || type === 'topic' || type === 'subtopic' || type === 'paragraph' ? 'base' : type,
        position,
        data: nodeData,
      };

      setNodes((nds) => [...nds, newNode]);
      return newNodeId;
    },
    [setNodes, getPositionInWorkspace, workspaceWidth]
  );

  // Function to copy a node
  const copyNode = useCallback((nodeId: string) => {
    const nodeToCopy = nodes.find((node) => node.id === nodeId);
    if (!nodeToCopy) return;

    // Store node data in localStorage for paste operation
    localStorage.setItem('copiedNode', JSON.stringify({
      type: nodeToCopy.type,
      data: nodeToCopy.data
    }));
  }, [nodes]);

  // Function to paste a copied node
  const pasteNode = useCallback((position: XYPosition) => {
    const copiedNodeStr = localStorage.getItem('copiedNode');
    if (!copiedNodeStr) return;

    try {
      const copiedNode = JSON.parse(copiedNodeStr);
      const newNodeId = uuidv4();
      
      // Ensure the position is within workspace
      const adjustedPosition = getPositionInWorkspace(position);

      const newNode: MindMapNode = {
        id: newNodeId,
        type: copiedNode.type,
        position: adjustedPosition,
        data: {
          ...copiedNode.data,
          // Regenerate any unique IDs in the data to avoid duplicates
          ...(copiedNode.data.checklistItems && {
            checklistItems: copiedNode.data.checklistItems.map((item: any) => ({
              ...item,
              id: uuidv4()
            }))
          }),
          ...(copiedNode.data.timelineEvents && {
            timelineEvents: copiedNode.data.timelineEvents.map((event: any) => ({
              ...event,
              id: uuidv4()
            }))
          }),
          ...(copiedNode.data.flashcards && {
            flashcards: copiedNode.data.flashcards.map((card: any) => ({
              ...card,
              id: uuidv4()
            }))
          }),
          ...(copiedNode.data.quizQuestions && {
            quizQuestions: copiedNode.data.quizQuestions.map((question: any) => ({
              ...question,
              id: uuidv4()
            }))
          })
        },
      };

      setNodes((nds) => [...nds, newNode]);
      return newNodeId;
    } catch (error) {
      console.error('Error pasting node:', error);
      return null;
    }
  }, [setNodes, getPositionInWorkspace]);

  // Function to duplicate a node (copy + paste in one step)
  const duplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = nodes.find((node) => node.id === nodeId);
    if (!nodeToDuplicate) return;

    const newNodeId = uuidv4();
    
    // Create a position slightly offset from the original
    const offsetPosition = {
      x: nodeToDuplicate.position.x + 20,
      y: nodeToDuplicate.position.y + 20
    };
    
    // Ensure the position is within workspace
    const adjustedPosition = getPositionInWorkspace(offsetPosition);

    const newNode: MindMapNode = {
      id: newNodeId,
      type: nodeToDuplicate.type,
      position: adjustedPosition,
      data: {
        ...nodeToDuplicate.data,
        // Regenerate any unique IDs in the data to avoid duplicates
        ...(nodeToDuplicate.data.checklistItems && {
          checklistItems: nodeToDuplicate.data.checklistItems.map((item: any) => ({
            ...item,
            id: uuidv4()
          }))
        }),
        ...(nodeToDuplicate.data.timelineEvents && {
          timelineEvents: nodeToDuplicate.data.timelineEvents.map((event: any) => ({
            ...event,
            id: uuidv4()
          }))
        }),
        ...(nodeToDuplicate.data.flashcards && {
          flashcards: nodeToDuplicate.data.flashcards.map((card: any) => ({
            ...card,
            id: uuidv4()
          }))
        }),
        ...(nodeToDuplicate.data.quizQuestions && {
          quizQuestions: nodeToDuplicate.data.quizQuestions.map((question: any) => ({
            ...question,
            id: uuidv4()
          }))
        })
      },
    };

    setNodes((nds) => [...nds, newNode]);
    return newNodeId;
  }, [nodes, setNodes, getPositionInWorkspace]);

  return {
    deleteNode,
    updateNodeData,
    addNode,
    copyNode,
    pasteNode,
    duplicateNode
  };
};
