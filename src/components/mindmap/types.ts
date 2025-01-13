import { Node } from '@xyflow/react';

export interface BaseNodeData {
  label: string;
  type?: 'rectangle' | 'circle' | 'diamond' | 'transparent';
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  fontFamily?: string;
  fontSize?: 'S' | 'M' | 'L' | 'XL';
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  [key: string]: unknown; // Add index signature
}

export type MindMapNode = Node<BaseNodeData>;

// Define global mindmap API type
declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
    };
  }
}