
import { Edge, Node } from 'reactflow';

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
