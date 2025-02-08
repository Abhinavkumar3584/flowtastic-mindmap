
import { Node as ReactFlowNode, NodeProps, Edge as ReactFlowEdge } from '@xyflow/react';

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

export interface EdgeData {
  color?: string;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  arrowStart?: boolean;
  arrowEnd?: boolean;
  pathStyle?: 'straight' | 'smoothstep' | 'bezier';
  strokeWidth?: number;
}

export type MindMapNode = ReactFlowNode<BaseNodeData>;
export type MindMapEdge = ReactFlowEdge<EdgeData>;
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
      updateEdgeStyle: (id: string, data: Partial<EdgeData>) => void;
    };
  }
}
