
import { MindMapNode, MindMapEdge } from './types';

export const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'base',
    data: { 
      id: '1',
      label: 'Main Idea',
      nodeType: 'title',
      backgroundColor: 'white',
      strokeColor: 'black',
      strokeWidth: 1,
      strokeStyle: 'solid',
      fontSize: 'xs',
      textAlign: 'center',
      opacity: 1,
      width: 180,
      height: 90,
    },
    position: { x: 400, y: 200 },
  },
];

export const initialEdges: MindMapEdge[] = [];
