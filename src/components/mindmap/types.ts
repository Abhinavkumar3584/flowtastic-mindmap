import { Edge, Node } from 'reactflow';

export interface MindMapData {
  nodes: Node[];
  edges: Edge[];
  name: string;
}

export interface BaseNodeData {
  id: string; // Add this to satisfy the Node constraint
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
