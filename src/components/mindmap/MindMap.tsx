import { useCallback, useState, useEffect } from 'react';
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
  Node,
  applyNodeChanges,
  NodeChange,
  EdgeMouseHandler
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
import { MindMapNode, BaseNodeData, MindMapEdge, EdgeData, OnEdgeClick } from './types';
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
import { EdgeSettings } from './EdgeSettings';
import { SectionNode } from './node-components/SectionNode';

const nodeTypes: NodeTypes = {
  base: BaseNode,
  section: SectionNode,
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
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C to copy
      if (e.ctrlKey && e.key === 'c') {
        const selectedNode = nodes.find(node => node.selected);
        if (selectedNode) {
          localStorage.setItem('mindmap-copied-node', JSON.stringify(selectedNode.data));
          toast({
            title: "Copied",
            description: "Node copied to clipboard",
          });
        }
      }
      
      // Ctrl+V to paste
      if (e.ctrlKey && e.key === 'v') {
        const copiedNodeData = localStorage.getItem('mindmap-copied-node');
        if (copiedNodeData) {
          try {
            const data = JSON.parse(copiedNodeData);
            const selectedNode = nodes.find(node => node.selected);
            if (selectedNode) {
              updateNodeData(selectedNode.id, data);
              toast({
                title: "Pasted",
                description: "Node data pasted",
              });
            } else {
              // Create a new node with the copied data
              addNode(data.nodeType || 'topic', data);
              toast({
                title: "Created",
                description: "New node created from clipboard",
              });
            }
          } catch (e) {
            console.error('Failed to parse copied node data', e);
          }
        }
      }
      
      // Delete to remove
      if (e.key === 'Delete') {
        const selectedNode = nodes.find(node => node.selected);
        if (selectedNode) {
          deleteNode(selectedNode.id);
          toast({
            title: "Deleted",
            description: "Node deleted",
          });
        }
      }
    };

    // Handle node duplication via custom event
    const handleDuplicateNode = (e: Event) => {
      const customEvent = e as CustomEvent;
      const nodeId = customEvent.detail.id;
      const nodeToDuplicate = nodes.find(node => node.id === nodeId);
      
      if (nodeToDuplicate) {
        const newNode = {
          ...nodeToDuplicate,
          id: `${nodes.length + 1}`,
          position: {
            x: nodeToDuplicate.position.x + 50,
            y: nodeToDuplicate.position.y + 50
          },
          selected: false
        };
        
        setNodes(prevNodes => [...prevNodes, newNode]);
        toast({
          title: "Duplicated",
          description: "Node has been duplicated",
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('duplicate-node', handleDuplicateNode);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('duplicate-node', handleDuplicateNode);
    };
  }, [nodes, toast]);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            data: {
              strokeStyle: 'solid',
              strokeWidth: 1,
              strokeColor: '#000000',
              arrowEnd: true
            },
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

  const onEdgeClick: OnEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdge(selectedEdge === edge.id ? null : edge.id);
  }, [selectedEdge]);

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

  const updateEdge = useCallback((id: string, newData: Partial<EdgeData>) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          const markerEnd = newData.arrowEnd !== undefined ? 
            (newData.arrowEnd ? { type: MarkerType.ArrowClosed } : undefined) :
            edge.markerEnd;

          const markerStart = newData.arrowStart !== undefined ? 
            (newData.arrowStart ? { type: MarkerType.ArrowClosed } : undefined) :
            edge.markerStart;

          return {
            ...edge,
            markerEnd,
            markerStart,
            data: {
              ...edge.data,
              ...newData,
            },
            style: {
              ...edge.style,
              stroke: newData.strokeColor || edge.style?.stroke,
              strokeWidth: newData.strokeWidth || edge.style?.strokeWidth,
              strokeDasharray: newData.strokeStyle === 'dashed' ? '5,5' : 
                               newData.strokeStyle === 'dotted' ? '1,5' : 
                               undefined
            }
          };
        }
        return edge;
      })
    );
    
  }, [setEdges]);

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
    updateEdge,
  };

  const addNode = (type: BaseNodeData['nodeType'], additionalData: Partial<BaseNodeData> = {}) => {
    if (!type) return;
    
    const newNode: MindMapNode = {
      id: `${nodes.length + 1}`,
      type: type === 'section' ? 'section' : 'base',
      data: { 
        label: additionalData.label || (type.charAt(0).toUpperCase() + type.slice(1)),
        nodeType: type,
        backgroundColor: additionalData.backgroundColor || 'white',
        strokeColor: additionalData.strokeColor || 'black',
        strokeWidth: additionalData.strokeWidth || 1,
        strokeStyle: additionalData.strokeStyle || 'solid',
        fontSize: additionalData.fontSize || 'xs',
        textAlign: additionalData.textAlign || 'center',
        opacity: additionalData.opacity || 1,
        hasCheckbox: additionalData.hasCheckbox || false,
        isChecked: additionalData.isChecked || false,
        ...additionalData
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
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
            
            {selectedEdge && edges.find(edge => edge.id === selectedEdge) && (
              <EdgeSettings 
                id={selectedEdge} 
                data={edges.find(edge => edge.id === selectedEdge)?.data || {}} 
              />
            )}
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
