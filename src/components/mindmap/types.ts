import { Node, NodeProps } from '@xyflow/react';

export type FontSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export interface BaseNodeData extends Record<string, unknown> {
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