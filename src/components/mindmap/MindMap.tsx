import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
import { MindMapNode, BaseNodeData } from './types';
import { ComponentsSidebar } from './ComponentsSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { saveMindMap, loadMindMap, getAllMindMaps, deleteMindMap } from '@/utils/mindmapStorage';
import { useToast } from '@/hooks/use-toast';

const nodeTypes: NodeTypes = {
  base: BaseNode,
};

const initialNodes: MindMapNode[] = [
  {
    id: '1',
    type: 'base',
    data: { 
      label: 'Main Idea',
      nodeType: 'title',
      backgroundColor: 'white',
      strokeColor: 'black',
      strokeWidth: 1,
      strokeStyle: 'solid',
      fontSize: 'xs',
      textAlign: 'center',
      opacity: 1
    },
    position: { x: 400, y: 200 },
  },
];

const initialEdges: Edge[] = [];

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<MindMapNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentMindMap, setCurrentMindMap] = useState<string>('');
  const [mindMapToDelete, setMindMapToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const deleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, [setNodes]);

  const updateNodeData = useCallback((id: string, newData: Partial<BaseNodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleExport = () => {
    if (!currentMindMap) {
      toast({
        title: "Error",
        description: "Please save your mind map before exporting",
        variant: "destructive",
      });
      return;
    }
    
    const exportUrl = `/export?name=${encodeURIComponent(currentMindMap)}`;
    window.open(exportUrl, '_blank');
  };

  const createNewMindMap = () => {
    const name = prompt('Enter a name for the new mind map:');
    if (!name) return;

    const success = saveMindMap({
      nodes: initialNodes,
      edges: [],
      name
    });

    if (success) {
      setNodes(initialNodes);
      setEdges([]);
      setCurrentMindMap(name);
      toast({
        title: "Success",
        description: `Created new mind map: ${name}`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to create new mind map",
        variant: "destructive",
      });
    }
  };

  const loadExistingMindMap = (name: string) => {
    const data = loadMindMap(name);
    if (data) {
      setNodes(data.nodes);
      setEdges(data.edges);
      setCurrentMindMap(name);
      toast({
        title: "Success",
        description: `Loaded mind map: ${name}`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to load mind map: ${name}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMindMap = (name: string) => {
    setMindMapToDelete(name);
  };

  const confirmDeleteMindMap = () => {
    if (!mindMapToDelete) return;

    const success = deleteMindMap(mindMapToDelete);
    if (success) {
      if (currentMindMap === mindMapToDelete) {
        setNodes(initialNodes);
        setEdges([]);
        setCurrentMindMap('');
      }
      toast({
        title: "Success",
        description: `Deleted mind map: ${mindMapToDelete}`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to delete mind map: ${mindMapToDelete}`,
        variant: "destructive",
      });
    }
    setMindMapToDelete(null);
  };

  const saveCurrentMindMap = useCallback(() => {
    if (!currentMindMap) {
      const name = prompt('Enter a name for the mind map:');
      if (!name) return;
      setCurrentMindMap(name);
      saveMindMap({ nodes, edges, name });
      toast({
        title: "Success",
        description: `Saved mind map as: ${name}`,
      });
    } else {
      saveMindMap({ nodes, edges, name: currentMindMap });
      toast({
        title: "Success",
        description: `Saved changes to: ${currentMindMap}`,
      });
    }
  }, [nodes, edges, currentMindMap, toast]);

  window.mindmapApi = {
    deleteNode,
    updateNodeData,
  };

  const addNode = (type: BaseNodeData['nodeType']) => {
    if (!type) return;
    
    const newNode: MindMapNode = {
      id: `${nodes.length + 1}`,
      type: 'base',
      data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1),
        nodeType: type,
        backgroundColor: 'white',
        strokeColor: 'black',
        strokeWidth: 1,
        strokeStyle: 'solid',
        fontSize: 'xs',
        textAlign: 'center',
        opacity: 1
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <SidebarProvider>
      <div className="w-full h-screen flex">
        <ComponentsSidebar onAddNode={addNode} />
        <div className="flex-1 relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button onClick={saveCurrentMindMap}>
              Save
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Load Mind Map
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {getAllMindMaps().map((name) => (
                  <DropdownMenuItem
                    key={name}
                    className="flex items-center justify-between group"
                  >
                    <span onClick={() => loadExistingMindMap(name)} className="flex-1 cursor-pointer">
                      {name}
                    </span>
                    <Trash2
                      className="h-4 w-4 text-destructive opacity-0 group-hover:opacity-100 cursor-pointer ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMindMap(name);
                      }}
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={createNewMindMap}>
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      <AlertDialog open={!!mindMapToDelete} onOpenChange={() => setMindMapToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the mind map
              "{mindMapToDelete}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMindMap} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};
