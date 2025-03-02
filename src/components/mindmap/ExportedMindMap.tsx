
import { useEffect, useState } from 'react';
import { ReactFlow, Background, NodeTypes, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
import { renderMindMap } from '@/utils/mindmapRenderer';
import { useToast } from '@/hooks/use-toast';
import { MindMapData, BaseNodeData, MindMapNode } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getAllMindMaps } from '@/utils/mindmapStorage';
import { Checkbox } from '@/components/ui/checkbox';

const nodeTypes: NodeTypes = {
  base: BaseNode,
};

export const ExportedMindMap = () => {
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);
  const [selectedMap, setSelectedMap] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<BaseNodeData | null>(null);
  const { toast } = useToast();
  const mindMaps = getAllMindMaps();

  useEffect(() => {
    console.log('Available mind maps:', mindMaps);
  }, [mindMaps]);

  // Function to update node data in the exported view
  const updateNodeData = (id: string, data: Partial<BaseNodeData>) => {
    if (!mindMapData) return;
    
    setMindMapData(prev => {
      if (!prev) return null;
      
      const updatedNodes = prev.nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            data: { ...node.data, ...data }
          };
        }
        return node;
      });
      
      return { ...prev, nodes: updatedNodes };
    });
  };

  // Initialize the mindmapApi for the exported view (limited functionality)
  useEffect(() => {
    window.mindmapApi = {
      deleteNode: () => {}, // No-op in exported view
      updateNodeData,
      updateEdge: () => {}, // No-op in exported view
    };

    return () => {
      window.mindmapApi = undefined;
    };
  }, [mindMapData]);

  const handleRender = () => {
    if (!selectedMap) {
      toast({
        title: "Error",
        description: "Please select a mind map to render",
        variant: "destructive",
      });
      return;
    }

    const data = renderMindMap(selectedMap);
    if (data) {
      console.log('Mind map data loaded:', data);
      setMindMapData(data);
    } else {
      console.error('Failed to load mind map:', selectedMap);
      toast({
        title: "Error",
        description: `Failed to load mind map: ${selectedMap}`,
        variant: "destructive",
      });
    }
  };

  const handleNodeClick = (_: React.MouseEvent, node: Node<BaseNodeData>) => {
    if (node.data.content) {
      setSelectedNode(node.data);
    }
  };

  // Handle checkbox change in the node detail dialog
  const handleCheckboxChange = (checked: boolean) => {
    if (selectedNode && mindMapData) {
      // Find the node ID
      const node = mindMapData.nodes.find(n => n.data.label === selectedNode.label);
      if (node) {
        updateNodeData(node.id, { isChecked: checked });
        
        // Also update the selected node state to reflect changes in the dialog
        setSelectedNode(prev => {
          if (!prev) return null;
          return { ...prev, isChecked: checked };
        });
        
        toast({
          title: "Updated",
          description: `${checked ? "Checked" : "Unchecked"} "${selectedNode.label}"`,
        });
      }
    }
  };

  if (!mindMapData) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <div className="flex gap-4 items-center">
          <Select value={selectedMap} onValueChange={setSelectedMap}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a mind map" />
            </SelectTrigger>
            <SelectContent>
              {mindMaps.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleRender}>Render</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen">
        <ReactFlow
          nodes={mindMapData.nodes}
          edges={mindMapData.edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNode?.content?.title || selectedNode?.label}</DialogTitle>
            <DialogDescription>
              Click outside to close
            </DialogDescription>
          </DialogHeader>
          
          {selectedNode?.hasCheckbox && (
            <div className="flex items-center gap-2 mb-4">
              <Checkbox 
                id="node-checkbox"
                checked={selectedNode.isChecked || false}
                onCheckedChange={handleCheckboxChange}
              />
              <label 
                htmlFor="node-checkbox" 
                className="text-sm font-medium cursor-pointer"
              >
                Mark as completed
              </label>
            </div>
          )}
          
          {selectedNode?.content?.description && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedNode.content.description}
              </p>
            </div>
          )}
          {selectedNode?.content?.links && selectedNode.content.links.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Links</h3>
              <div className="space-y-2">
                {selectedNode.content.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
