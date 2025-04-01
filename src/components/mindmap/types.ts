
import { Node as ReactFlowNode, Edge, NodeProps } from '@xyflow/react';

// Define interfaces for different node types
export interface BaseNodeData {
  label: string;
  nodeType?: string;
  fontSize?: number;
  fontWeight?: string;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: string;
  opacity?: number;
  borderRadius?: number;
  rotation?: number;
  textAlign?: string;
  shadow?: {
    enabled: boolean;
    color?: string;
    offsetX?: number;
    offsetY?: number;
    blur?: number;
  };
  glow?: {
    enabled: boolean;
    color?: string;
    blur?: number;
  };
  content?: {
    title?: string;
    description?: string;
    links?: { label: string; url: string }[];
  };
  // Section node specific data
  sections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  // Checklist node specific data
  checklistItems?: Array<{
    id: string;
    text: string;
    isChecked: boolean;
    priority?: 'low' | 'medium' | 'high';
  }>;
  // Timeline node specific data
  timelineEvents?: Array<{
    id: string;
    title: string;
    date: string;
    description?: string;
    color?: string;
  }>;
  // Shape nodes specific data
  shapeType?: 'circle' | 'rectangle' | 'square' | 'triangle';
  // Flashcard node specific data
  flashcards?: Array<{
    id: string;
    question: string;
    answer: string;
    tags?: string[];
  }>;
  // Quiz node specific data
  quizTitle?: string;
  quizQuestions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
  // MindMap node specific data
  mapItems?: Array<{
    id: string;
    text: string;
    children: Array<{
      id: string;
      text: string;
      children: any[];
    }>;
  }>;
  // Note node specific data
  noteContent?: string;
  noteColor?: string;
  tags?: string[];
  // Concept node specific data
  definition?: string;
  examples?: string[];
  relatedConcepts?: string[];
  isCollapsed?: boolean;
}

// Edge data interface
export interface EdgeData {
  label?: string;
  animated?: boolean;
  style?: {
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  };
}

// Mind map data structure for storage and retrieval
export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  name?: string;
}

// Fix the type error by ensuring MindMapNode is properly defined
export type MindMapNode = ReactFlowNode<BaseNodeData>;
export type MindMapEdge = Edge<EdgeData>;
export type MindMapNodeProps = NodeProps<BaseNodeData>;
