import { Node, NodeProps } from '@xyflow/react';

export type FontSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface LinkItem {
  id: string;
  url: string;
  label: string;
}

export interface ContentItem {
  id: string;
  text: string;
  type: 'text' | 'heading' | 'list';
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
  content?: ContentItem[];
  links?: LinkItem[];
}

export type MindMapNode = Node<BaseNodeData>;
export type MindMapNodeProps = NodeProps<BaseNodeData>;

declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
      updateNodeData: (id: string, data: Partial<BaseNodeData>) => void;
    };
  }
}