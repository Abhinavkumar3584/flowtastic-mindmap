
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
  fontSize?: number | string;
  fontColor?: string;
  width?: number | string;
  height?: number | string;
  status?: string;
  notes?: string;
  content?: any;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  borderRadius?: number;
  rotation?: number;
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
  aspectRatio?: boolean;
  opacity?: number;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  legend?: {
    enabled: boolean;
    position: LegendPosition;
    text?: string;
    color?: string; // Added color property to fix typing errors
  };
  // Additional properties for specialized nodes
  checklistItems?: any[];
  isChecked?: boolean;
  hasCheckbox?: boolean;
  noteContent?: string;
  noteColor?: string;
  tags?: string[];
  definition?: string;
  examples?: string[];
  pinned?: boolean;
  resources?: any[];
  questions?: any[];
  flashcards?: any[];
  branches?: any[];
  startDate?: string;
  endDate?: string;
  timelineItems?: any[];
  position?: { x: number; y: number };
  [key: string]: any; // Index signature to allow additional properties
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

export interface MindMapNodeProps {
  data: BaseNodeData;
  id: string;
  selected?: boolean;
}

export type MindMapNode = Node<BaseNodeData>;
export type MindMapEdge = Edge;

export type EdgeData = {
  label?: string;
  animated?: boolean;
  style?: string;
  color?: string;
  width?: number;
  arrowType?: 'default' | 'closed' | 'none';
  strokeWidth?: number;
  strokeColor?: string;
  strokeStyle?: string;
  pathStyle?: string;
  arrowStart?: string;
  arrowEnd?: string;
  [key: string]: any; // Index signature to allow additional properties
};

export type OnEdgeClick = (event: React.MouseEvent, edge: MindMapEdge) => void;

export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 's' | 'm' | 'l';
export type NodeContent = { title?: string; description?: string; links?: { label: string; url: string }[] };
export type LegendPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-center' | 'left-bottom' | 'right-top' | 'right-center' | 'right-bottom';

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

// Add a global declaration for the mindmapApi
declare global {
  interface Window {
    mindmapApi?: {
      deleteNode: (id: string) => void;
      updateNodeData: (id: string, updates: Partial<BaseNodeData>) => void;
      updateEdge: (id: string, updates: Partial<EdgeData>) => void;
      copyNode: (id: string) => void;
      pasteNode: (id: string) => void;
      duplicateNode: (id: string) => void;
    };
  }
}
