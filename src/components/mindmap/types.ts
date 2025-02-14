
import { Node as ReactFlowNode, NodeProps, Edge, MarkerType } from '@xyflow/react';

export type FontSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export type LegendPosition = 
  | 'left-top' 
  | 'left-center' 
  | 'left-bottom' 
  | 'right-top' 
  | 'right-center' 
  | 'right-bottom';

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
  nodeType?: 'title' | 'topic' | 'subtopic' | 'paragraph' | 'section';
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  fontFamily?: string;
  fontSize?: FontSize;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  content?: NodeContent;
  legend?: {
    enabled: boolean;
    position: LegendPosition;
    color: string;
  };
}

export interface EdgeData {
  label?: string;
  markerStart?: { type: MarkerType };
  markerEnd?: { type: MarkerType };
  type?: string;
  animated?: boolean;
  style?: {
    strokeDasharray?: string;
    stroke?: string;
  };
}

export type MindMapData = {
  nodes: Array<MindMapNode>;
  edges: Array<MindMapEdge>;
  name?: string;
};

export type MindMapNode = ReactFlowNode<BaseNodeData>;
export type MindMapEdge = Edge<EdgeData>;
export type MindMapNodeProps = NodeProps<BaseNodeData>;

declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
      updateNodeData: (id: string, data: Partial<BaseNodeData>) => void;
      updateEdge: (id: string, data: Partial<EdgeData>) => void;
    };
  }
}
