
import { Node, NodeProps, Edge, EdgeMouseHandler } from '@xyflow/react';

export type FontSize = 'xs' | 's' | 'm' | 'l' | 'xl';

export type LegendPosition = 
  | 'left-top' 
  | 'left-center' 
  | 'left-bottom' 
  | 'right-top' 
  | 'right-center' 
  | 'right-bottom';

export interface WorkspaceSettings {
  width: number;
  visible: boolean;
}

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
  nodeType?: 'title' | 'topic' | 'subtopic' | 'paragraph' | 'section' | 'checklist' | 'timeline' | 'resource' | 'circle' | 'rectangle' | 'square' | 'triangle' | 'flashcard' | 'quiz' | 'mindmap' | 'note' | 'concept';
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
  rotation?: number;
  aspectRatio?: boolean;
  shadow?: {
    enabled: boolean;
    color?: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
  };
  glow?: {
    enabled: boolean;
    color?: string;
    blur?: number;
  };
  zIndex?: number;
  
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
    color?: string;
    description?: string;
    isCompleted?: boolean;
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
    description?: string;
  }>;
  
  // Flashcard specific properties
  flashcards?: Array<{
    id: string;
    question: string;
    answer: string;
    category?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    status?: 'new' | 'learning' | 'review' | 'mastered';
  }>;
  
  // Quiz specific properties
  questions?: Array<{
    id: string;
    text: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
    explanation?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }>;
  
  // Mindmap specific properties
  branches?: Array<{
    id: string;
    label: string;
    children?: Array<string>; // IDs of child nodes
    color?: string;
  }>;
  
  // Note specific properties
  noteContent?: string;
  noteColor?: string;
  pinned?: boolean;
  tags?: string[];
  
  // Concept specific properties
  definition?: string;
  examples?: string[];
  relationships?: Array<{
    id: string;
    relatedConceptId: string;
    relationshipType: 'parent' | 'child' | 'related' | 'opposite';
  }>;
  importance?: 'low' | 'medium' | 'high';
  
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
  workspaceSettings?: WorkspaceSettings;
};

// Fix the type error by ensuring MindMapNode doesn't try to extend the wrong type
export type MindMapNode = Node<BaseNodeData>;
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
