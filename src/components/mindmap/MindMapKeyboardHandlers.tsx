
import { useEffect } from 'react';
import { MindMapNode } from './types';
import { useToast } from '@/hooks/use-toast';

interface MindMapKeyboardHandlersProps {
  nodes: MindMapNode[];
  deleteNode: (id: string) => void;
  updateNodeData: (id: string, data: any) => void;
  addNode: (type: string, additionalData?: any) => void;
}

export const useMindMapKeyboardHandlers = ({
  nodes,
  deleteNode,
  updateNodeData,
  addNode,
}: MindMapKeyboardHandlersProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C to copy
      if (e.ctrlKey && e.key === 'c') {
        const selectedNode = nodes.find(node => node.selected);
        if (selectedNode) {
          localStorage.setItem('mindmap-copied-node', JSON.stringify(selectedNode.data));
          toast({
            title: "Copied",
            description: "Node copied to clipboard",
          });
        }
      }
      
      // Ctrl+V to paste
      if (e.ctrlKey && e.key === 'v') {
        const copiedNodeData = localStorage.getItem('mindmap-copied-node');
        if (copiedNodeData) {
          try {
            const data = JSON.parse(copiedNodeData);
            const selectedNode = nodes.find(node => node.selected);
            if (selectedNode) {
              updateNodeData(selectedNode.id, data);
              toast({
                title: "Pasted",
                description: "Node data pasted",
              });
            } else {
              // Create a new node with the copied data
              addNode(data.nodeType || 'topic', data);
              toast({
                title: "Created",
                description: "New node created from clipboard",
              });
            }
          } catch (e) {
            console.error('Failed to parse copied node data', e);
          }
        }
      }
      
      // Delete to remove
      if (e.key === 'Delete') {
        const selectedNode = nodes.find(node => node.selected);
        if (selectedNode) {
          deleteNode(selectedNode.id);
          toast({
            title: "Deleted",
            description: "Node deleted",
          });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nodes, deleteNode, updateNodeData, addNode, toast]);

  useEffect(() => {
    // Handle node duplication via custom event
    const handleDuplicateNode = (e: Event) => {
      const customEvent = e as CustomEvent;
      const nodeId = customEvent.detail.id;
      const nodeToDuplicate = nodes.find(node => node.id === nodeId);
      
      if (nodeToDuplicate) {
        const newNode = {
          ...nodeToDuplicate,
          id: `${nodes.length + 1}`,
          position: {
            x: nodeToDuplicate.position.x + 50,
            y: nodeToDuplicate.position.y + 50
          },
          selected: false
        };
        
        // Add the new node
        addNode(
          nodeToDuplicate.data.nodeType || 'topic', 
          {
            ...nodeToDuplicate.data,
            position: {
              x: nodeToDuplicate.position.x + 50,
              y: nodeToDuplicate.position.y + 50
            }
          }
        );
        
        toast({
          title: "Duplicated",
          description: "Node has been duplicated",
        });
      }
    };
    
    document.addEventListener('duplicate-node', handleDuplicateNode);
    
    return () => {
      document.removeEventListener('duplicate-node', handleDuplicateNode);
    };
  }, [nodes, addNode, toast]);
};
