
import { Node as ReactFlowNode, NodeProps, Edge, EdgeMouseHandler } from '@xyflow/react';

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
  nodeType?: 'title' | 'topic' | 'subtopic' | 'paragraph' | 'section' | 'checklist' | 'timeline' | 'resource';
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
  hasCheckbox?: boolean;
  isChecked?: boolean;
  position?: { x: number; y: number };
  
  // Checklist specific properties
  checklistItems?: Array<{
    id: string;
    text: string;
    isChecked: boolean;
    priority?: 'low' | 'medium' | 'high';
  }>;
  
  // Timeline specific properties
  timelineEvents?: Array<{
    id: string;
    title: string;
    date: string;
    isMilestone: boolean;
  }>;
  startDate?: string;
  endDate?: string;
  
  // Resource specific properties
  resources?: Array<{
    id: string;
    title: string;
    url: string;
    type: 'pdf' | 'video' | 'website' | 'other';
    rating?: 1 | 2 | 3 | 4 | 5;
    tags?: string[];
  }>;
  
  [key: string]: any;
}

export interface EdgeData {
  label?: string;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  pathStyle?: 'straight' | 'curved' | 'step' | 'smoothstep' | 'loopback' | 'zigzag' | 'wavy';
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  strokeColor?: string;
  strokeWidth?: number;
  [key: string]: any;
}

export type MindMapData = {
  nodes: Array<MindMapNode>;
  edges: Array<MindMapEdge>;
  name?: string;
};

export type MindMapNode = ReactFlowNode<BaseNodeData>;
export type MindMapEdge = Edge<EdgeData>;
export type MindMapNodeProps = NodeProps<BaseNodeData>;
export type OnEdgeClick = EdgeMouseHandler;

declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
      updateNodeData: (id: string, data: Partial<BaseNodeData>) => void;
      updateEdge: (id: string, data: Partial<EdgeData>) => void;
      copyNode?: (id: string) => void;
      pasteNode?: (id: string | null) => void;
      duplicateNode?: (id: string) => void;
    };
  }
}
