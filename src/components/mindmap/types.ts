import { Node } from '@xyflow/react';

export interface BaseNodeData {
  label: string;
  type?: 'rectangle' | 'circle' | 'diamond' | 'transparent';
  nodeType?: 'title' | 'topic' | 'subtopic' | 'paragraph' | 'label' | 'button' | 'legend' | 'todo' | 'checklist' | 'linksGroup' | 'horizontalLine' | 'verticalLine' | 'resourceButton' | 'section';
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  fontFamily?: string;
  fontSize?: 'S' | 'M' | 'L' | 'XL';
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  [key: string]: any; // Add index signature for additional properties
}

export type MindMapNode = Node<BaseNodeData>;

declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
    };
  }
}