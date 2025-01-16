import { useCallback } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BaseNode } from './BaseNode';
import { MindMapNode, BaseNodeData } from './types';
import { ComponentsSidebar } from './ComponentsSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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
      opacity: 1,
      content: [],
      links: []
    },
    position: { x: 400, y: 200 },
  },
];

const initialEdges: Edge[] = [];

export const MindMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<BaseNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
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
        opacity: 1,
        content: [],
        links: []
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const exportMindMap = () => {
    const mindMapData = {
      nodes,
      edges,
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Exported Mind Map</title>
          <script src="https://unpkg.com/@xyflow/react/dist/umd/index.js"></script>
          <link href="https://unpkg.com/@xyflow/react/dist/style.css" rel="stylesheet" />
          <script>
            window.mindMapData = ${JSON.stringify(mindMapData)};
          </script>
          <style>
            body { margin: 0; padding: 0; }
            .mindmap-container { width: 100vw; height: 100vh; }
            .dialog { 
              padding: 20px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              max-width: 500px;
              margin: 20px auto;
            }
            .dialog h3 { margin-bottom: 16px; }
            .content-item, .link-item {
              padding: 8px;
              background: #f1f1f1;
              margin: 4px 0;
              border-radius: 4px;
            }
            .link-item {
              display: block;
              text-decoration: none;
              color: #333;
            }
            .close-button {
              margin-top: 16px;
              padding: 8px 16px;
              background: #6366F1;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div id="mindmap" class="mindmap-container"></div>
          <script>
            const { nodes, edges } = window.mindMapData;
            const nodeTypes = {
              base: {
                render: (nodeProps) => {
                  const { data } = nodeProps;
                  const style = {
                    background: data.backgroundColor || 'white',
                    border: \`\${data.strokeWidth}px \${data.strokeStyle} \${data.strokeColor}\`,
                    borderRadius: '8px',
                    padding: '10px',
                    minWidth: '100px',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: data.fontSize === 'xs' ? '10px' : 
                             data.fontSize === 's' ? '12px' :
                             data.fontSize === 'm' ? '14px' :
                             data.fontSize === 'l' ? '16px' : '20px',
                    textAlign: data.textAlign || 'center',
                    opacity: data.opacity || 1,
                  };

                  return ReactFlow.createElement(
                    'div',
                    { 
                      style,
                      onClick: () => {
                        if (data.content?.length || data.links?.length) {
                          const dialog = document.createElement('dialog');
                          dialog.className = 'dialog';
                          dialog.innerHTML = \`
                            <h3>\${data.label}</h3>
                            \${data.content?.length ? \`
                              <div style="margin-bottom: 16px;">
                                <h4>Content</h4>
                                \${data.content.map(item => \`
                                  <div class="content-item">\${item.text}</div>
                                \`).join('')}
                              </div>
                            \` : ''}
                            \${data.links?.length ? \`
                              <div>
                                <h4>Links</h4>
                                \${data.links.map(link => \`
                                  <a href="\${link.url}" target="_blank" class="link-item">
                                    \${link.label}
                                  </a>
                                \`).join('')}
                              </div>
                            \` : ''}
                            <button class="close-button" onclick="this.closest('dialog').close()">
                              Close
                            </button>
                          \`;
                          document.body.appendChild(dialog);
                          dialog.showModal();
                          dialog.addEventListener('click', (e) => {
                            if (e.target === dialog) dialog.close();
                          });
                        }
                      }
                    },
                    data.label,
                    data.content?.length || data.links?.length ? 
                      ReactFlow.createElement('div', { 
                        style: { 
                          fontSize: '10px',
                          color: '#666',
                          marginTop: '4px'
                        } 
                      }, 'Click to view details') : null
                  );
                }
              }
            };

            new ReactFlow.ReactFlow({
              nodes,
              edges,
              nodeTypes,
              fitView: true,
              nodesDraggable: false,
              nodesConnectable: false,
              elementsSelectable: true,
            });
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    toast({
      title: "Mind Map Exported",
      description: "Your mind map has been exported to a new tab",
    });
  };

  return (
    <SidebarProvider>
      <div className="w-full h-screen flex">
        <ComponentsSidebar onAddNode={addNode} />
        <div className="flex-1 relative">
          <div className="absolute top-4 right-4 z-10">
            <Button onClick={exportMindMap}>
              Export Mind Map
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
    </SidebarProvider>
  );
};