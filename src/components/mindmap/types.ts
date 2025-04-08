
import { Edge, Node } from '@xyflow/react';

export interface MindMapData {
  nodes: Node[];
  edges: Edge[];
  name: string;
  examCategory?: string;
  subExamName?: string;
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
  content?: any;
  // Extended properties for node visual styling
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  opacity?: number;
  textAlign?: 'left' | 'center' | 'right';
  rotation?: number;
  fontFamily?: string;
  shadow?: {
    enabled: boolean;
    offsetX?: number;
    offsetY?: number;
    blur?: number;
    color?: string;
  };
  glow?: {
    enabled: boolean;
    blur?: number;
    color?: string;
  };
  hasCheckbox?: boolean;
  isChecked?: boolean;
  zIndex?: number;
  // Type-specific properties
  borderRadius?: number;
  // For checklist nodes
  checklistItems?: any[];
  // For timeline nodes
  startDate?: string;
  endDate?: string;
  timelineEvents?: any[];
  // For resource nodes
  resources?: any[];
  // For flashcard nodes
  flashcards?: any[];
  // For quiz nodes
  questions?: any[];
  // For mind map nodes
  branches?: any[];
  // For note nodes
  noteContent?: string;
  noteColor?: string;
  pinned?: boolean;
  tags?: string[];
  // For concept nodes
  definition?: string;
  importance?: string;
  examples?: string[];
  // For shape nodes
  aspectRatio?: number;
  // For legend
  legend?: {
    show: boolean;
    position: LegendPosition;
    title: string;
    color?: string;
    enabled?: boolean;
    items: Array<{id: string, label: string, color: string}>;
  };
  [key: string]: any; // Index signature to satisfy Record<string, unknown>
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

export type ExamCategory = 
  | 'SSC EXAMS'
  | 'BANKING EXAMS'
  | 'CIVIL SERVICES EXAMS'
  | 'RAILWAY EXAMS'
  | 'DEFENCE EXAMS'
  | 'INSURANCES EXAMS'
  | 'NURSING EXAMS'
  | 'PG EXAMS'
  | 'CAMPUS PLACEMENT EXAMS'
  | 'MBA EXAMS'
  | 'ACCOUNTING AND COMMERCE EXAMS'
  | 'JUDICIARY EXAMS'
  | 'REGULATORY BODY EXAMS'
  | 'CUET AND UG ENTRANCE EXAMS'
  | 'POLICE EXAMS'
  | 'OTHER GOVT. EXAMS'
  | 'SCHOOL EXAMS'
  | 'TEACHING EXAMS'
  | 'ENGINEERING RECRUITING EXAMS'
  | 'LABOUR EXAMS';

export const EXAM_CATEGORIES: ExamCategory[] = [
  'SSC EXAMS',
  'BANKING EXAMS',
  'CIVIL SERVICES EXAMS',
  'RAILWAY EXAMS',
  'DEFENCE EXAMS',
  'INSURANCES EXAMS',
  'NURSING EXAMS',
  'PG EXAMS',
  'CAMPUS PLACEMENT EXAMS',
  'MBA EXAMS',
  'ACCOUNTING AND COMMERCE EXAMS',
  'JUDICIARY EXAMS',
  'REGULATORY BODY EXAMS',
  'CUET AND UG ENTRANCE EXAMS',
  'POLICE EXAMS',
  'OTHER GOVT. EXAMS',
  'SCHOOL EXAMS',
  'TEACHING EXAMS',
  'ENGINEERING RECRUITING EXAMS',
  'LABOUR EXAMS'
];

export type MindMapNodeProps = {
  data: BaseNodeData;
  id: string;
  selected: boolean;
};

export type EdgeData = {
  label?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  type?: string;
  arrowStart?: boolean;
  arrowEnd?: boolean;
  strokeWidth?: number;
  strokeColor?: string;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  pathStyle?: 'bezier' | 'straight' | 'step';
  [key: string]: any; // Index signature
};

export type MindMapNode = Node<BaseNodeData>;
export type MindMapEdge = Edge<EdgeData>;

export type OnEdgeClick = (event: React.MouseEvent, edge: MindMapEdge) => void;

export type FontSize = "xs" | "s" | "m" | "l" | "xl";
export type NodeContent = string | { title?: string; description?: string; links?: Array<{label: string, url: string}>; };
export type LegendPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

// Define window interface to allow mindmapApi global object
declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
      updateNodeData: (id: string, updates: Partial<BaseNodeData>) => void;
      updateEdge: (id: string, updates: Partial<EdgeData>) => void;
      copyNode: (id: string) => void;
      pasteNode: (targetId: string) => void;
      duplicateNode: (id: string) => void;
    };
  }
}
