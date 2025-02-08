
import { Node, NodeProps } from '@xyflow/react';

export type FontSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface NodeContent {
  title?: string;
  description?: string;
  links?: Array<{
    url: string;
    label: string;
  }>;
}

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
  content?: NodeContent;
  [key: string]: any;
}

export type MindMapNode = Node<BaseNodeData>;
export type MindMapNodeProps = NodeProps<BaseNodeData>;

export interface MindMapData {
  nodes: MindMapNode[];
  edges: any[];
  name: string;
}

declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
      updateNodeData: (id: string, data: Partial<BaseNodeData>) => void;
    };
  }
}
