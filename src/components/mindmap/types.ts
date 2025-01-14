import { Node } from '@xyflow/react';

export interface BaseNodeData {
  label: string;
  nodeType?: 'title' | 'topic' | 'subtopic' | 'paragraph' | 'button' | 'section' | 'rectangle' | 'diamond' | 'circle';
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  fontFamily?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
}

export type MindMapNode = Node<BaseNodeData>;

declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
    };
  }
}