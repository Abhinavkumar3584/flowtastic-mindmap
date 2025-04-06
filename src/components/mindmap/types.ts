
import { Edge, Node } from '@xyflow/react';

export interface MindMapData {
  nodes: Node[];
  edges: Edge[];
  name: string;
  examCategory?: string;     // Main exam category
  examSubcategory?: string;  // Specific exam name within category
}

export interface BaseNodeData {
  id: string; 
  label: string;
  nodeType?: string;
  color?: string;
  fontSize?: number;
  fontColor?: string;
  width?: number;
  height?: number;
  status?: string;
  notes?: string;
  content?: string;
}

export interface TopicNodeData extends BaseNodeData {
  nodeType: 'topic';
}

export interface SubtopicNodeData extends BaseNodeData {
  nodeType: 'subtopic';
  content: string;
}

export interface TaskNodeData extends BaseNodeData {
  nodeType: 'task';
  status: 'open' | 'inProgress' | 'completed';
}

// Types for MindMap components
export interface MindMapNodeProps {
  id: string;
  data: BaseNodeData;
  selected?: boolean;
}

export interface MindMapNode extends Node<BaseNodeData> {}
export interface MindMapEdge extends Edge {}

export interface EdgeData {
  animated?: boolean;
  label?: string;
  type?: string;
  color?: string;
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  curvature?: number;
}

export interface FontSize {
  size: 'xs' | 's' | 'm' | 'l' | 'xl';
  value: number;
}

export interface NodeContent {
  title?: string;
  description?: string;
  links?: { label: string; url: string }[];
}

export enum LegendPosition {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
  NONE = 'none'
}

export interface OnEdgeClick {
  (event: React.MouseEvent, edge: MindMapEdge): void;
}

// Exam categories for mind maps
export const EXAM_CATEGORIES = [
  "SSC EXAMS",
  "BANKING EXAMS",
  "CIVIL SERVICES EXAMS",
  "RAILWAY EXAMS",
  "DEFENCE EXAMS",
  "INSURANCES EXAMS",
  "NURSING EXAMS",
  "PG EXAMS",
  "CAMPUS PLACEMENT EXAMS",
  "MBA EXAMS",
  "ACCOUNTING AND COMMERCE EXAMS",
  "JUDICIARY EXAMS",
  "REGULATORY BODY EXAMS",
  "CUET AND UG ENTRANCE EXAMS",
  "POLICE EXAMS",
  "OTHER GOVT. EXAMS",
  "SCHOOL EXAMS",
  "TEACHING EXAMS",
  "ENGINEERING RECRUITING EXAMS",
  "LABOUR EXAMS"
];

// Make sure window has mindmapApi property
declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
      updateNodeData: (id: string, data: Partial<BaseNodeData>) => void;
      updateEdge: (id: string, data: Partial<EdgeData>) => void;
      copyNode: (id: string) => void;
      pasteNode: () => void;
      duplicateNode: (id: string) => void;
    };
  }
}
