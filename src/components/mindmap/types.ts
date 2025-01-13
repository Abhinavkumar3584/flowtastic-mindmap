import { Node } from '@xyflow/react';

export interface BaseNodeData {
  label: string;
  nodeType?: 'title' | 'topic' | 'subtopic' | 'paragraph' | 'label' | 'button' | 'legend' | 'todo' | 'checklist' | 'linksGroup' | 'horizontalLine' | 'verticalLine' | 'resourceButton' | 'section';
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  fontFamily?: string;
  fontSize?: 'S' | 'M' | 'L' | 'XL';
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  width?: number;
  height?: number;
  lineStyle?: {
    color: string;
    width: number;
    style: 'solid' | 'dashed';
  };
}

export type MindMapNode = Node<BaseNodeData>;

declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
    };
  }
}