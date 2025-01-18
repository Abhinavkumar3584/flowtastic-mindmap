import { Node, NodeProps } from '@xyflow/react';

export type FontSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface BaseNodeData {
  label: string;
  nodeType?: 'title' | 'topic' | 'subtopic' | 'paragraph' | 'button' | 'section' | 'rectangle' | 'diamond' | 'circle';
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  fontFamily?: string;
  fontSize?: FontSize;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  [key: string]: unknown;
}

export type MindMapNode = Node<BaseNodeData>;
export type MindMapNodeProps = NodeProps<BaseNodeData>;

export interface MindMapData {
  nodes: MindMapNode[];
  edges: any[];
  name: string;
}