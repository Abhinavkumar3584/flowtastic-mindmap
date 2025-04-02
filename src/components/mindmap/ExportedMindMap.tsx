
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { renderMindMap } from '@/utils/mindmapRenderer';
import { BaseNode } from './BaseNode';
import { SectionNode } from './node-components/SectionNode';
import { ChecklistNode } from './node-components/ChecklistNode';
import { TimelineNode } from './node-components/TimelineNode';
import { ResourceNode } from './node-components/ResourceNode';
import { CircleNode } from './node-components/CircleNode';
import { RectangleNode } from './node-components/RectangleNode';
import { SquareNode } from './node-components/SquareNode';
import { TriangleNode } from './node-components/TriangleNode';
import { FlashcardNode } from './node-components/FlashcardNode';
import { QuizNode } from './node-components/QuizNode';
import { MindMapNode as MindMapNodeComponent } from './node-components/MindMapNode';
import { NoteNode } from './node-components/NoteNode';
import { ConceptNode } from './node-components/ConceptNode';
import { MindMapData, WorkspaceSettings } from './types';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';

const nodeTypes: NodeTypes = {
  base: BaseNode,
  section: SectionNode,
  checklist: ChecklistNode,
  timeline: TimelineNode,
  resource: ResourceNode,
  circle: CircleNode,
  rectangle: RectangleNode,
  square: SquareNode,
  triangle: TriangleNode,
  flashcard: FlashcardNode,
  quiz: QuizNode,
  mindmap: MindMapNodeComponent,
  note: NoteNode,
  concept: ConceptNode,
};

// Default settings for printing/exporting
const defaultWorkspaceSettings: WorkspaceSettings = {
  width: 800,
  visible: false,
  enforced: true
};

const ExportFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [searchParams] = useSearchParams();
  const [mapName, setMapName] = useState<string>('');
  const [workspaceSettings, setWorkspaceSettings] = useState<WorkspaceSettings>(defaultWorkspaceSettings);
  const [isReady, setIsReady] = useState(false);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    const name = searchParams.get('map');
    if (name) {
      setMapName(name);
      const mindMap = renderMindMap(name);
      
      if (mindMap) {
        // Set workspace settings if they exist
        if (mindMap.workspaceSettings) {
          setWorkspaceSettings({
            ...mindMap.workspaceSettings,
            visible: false // Always hide the workspace in export view
          });
        }
        
        setNodes(mindMap.nodes);
        setEdges(mindMap.edges);
        
        // Wait for nodes to be rendered before fitting view
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.2 });
          setIsReady(true);
        }, 100);
      }
    }
  }, [searchParams, setNodes, setEdges, reactFlowInstance]);

  const downloadAsPng = () => {
    const reactFlowContainer = document.querySelector('.react-flow') as HTMLElement;
    if (!reactFlowContainer) return;

    // Hide controls, minimap, and background for screenshot
    const controls = document.querySelector('.react-flow__controls');
    const minimap = document.querySelector('.react-flow__minimap');
    const background = document.querySelector('.react-flow__background');
    
    if (controls) (controls as HTMLElement).style.display = 'none';
    if (minimap) (minimap as HTMLElement).style.display = 'none';
    if (background) (background as HTMLElement).style.display = 'none';

    // Use html2canvas library for screenshot
    html2canvas(reactFlowContainer, {
      backgroundColor: '#f9fafb',
      scale: 2
    }).then((canvas) => {
      // Create download link
      const link = document.createElement('a');
      link.download = `${mapName || 'mindmap'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // Restore the hidden elements
      if (controls) (controls as HTMLElement).style.display = '';
      if (minimap) (minimap as HTMLElement).style.display = '';
      if (background) (background as HTMLElement).style.display = '';
    });
  };

  const printMindMap = () => {
    window.print();
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold">Mind Map: {mapName}</h1>
        <div className="flex gap-2">
          <Button onClick={downloadAsPng} disabled={!isReady}>
            <Download className="h-4 w-4 mr-1" />
            Download as PNG
          </Button>
          <Button onClick={printMindMap} disabled={!isReady}>
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
      <style>
        {`
        @media print {
          .react-flow__controls, .react-flow__minimap, .react-flow__attribution, .react-flow__background {
            display: none !important;
          }
          body, html, .react-flow, .react-flow__renderer {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          #root {
            height: 100% !important;
          }
          .react-flow__node {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          button, .p-4 {
            display: none !important;
          }
        }
        `}
      </style>
    </div>
  );
};

export const ExportedMindMap = () => {
  return (
    <ReactFlowProvider>
      <ExportFlow />
    </ReactFlowProvider>
  );
};
