
import { Node as ReactFlowNode, NodeProps, Edge } from '@xyflow/react';

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
  nodeType?: 'title' | 'topic' | 'subtopic' | 'paragraph';
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

export interface EdgeData extends Record<string, any> {
  label?: string;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  pathStyle?: 'straight' | 'curved' | 'step';
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  strokeColor?: string;
  strokeWidth?: number;
}

export type MindMapNode = ReactFlowNode<BaseNodeData>;
export type MindMapEdge = Edge<EdgeData>;
export type MindMapNodeProps = NodeProps<BaseNodeData>;

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
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
