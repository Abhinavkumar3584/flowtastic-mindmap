
import { useCallback } from 'react';
import { MindMapNode, BaseNodeData } from '../types';
import { addNode as addNewNode } from '../MindMapNodeManager';

interface UseMindMapNodeHandlersProps {
  nodes: MindMapNode[];
  setNodes: React.Dispatch<React.SetStateAction<MindMapNode[]>>;
}

export const useMindMapNodeHandlers = ({ nodes, setNodes }: UseMindMapNodeHandlersProps) => {
  // Delete node
  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, [setNodes]);

  // Update node data
  const updateNodeData = useCallback((id: string, newData: Partial<BaseNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Add a new node
  const addNode = useCallback((type: BaseNodeData['nodeType'], additionalData: Partial<BaseNodeData> = {}) => {
    addNewNode(setNodes, nodes, type, additionalData);
  }, [nodes, setNodes]);

  return {
    deleteNode,
    updateNodeData,
    addNode
  };
};
