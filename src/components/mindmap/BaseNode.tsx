import { NodeResizer } from '@xyflow/react';
import { useState, useEffect } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Textarea } from "@/components/ui/textarea";
import { NodeSettings } from './NodeSettings';
import { NodeConnectors } from './NodeConnectors';
import { MindMapNodeProps, BaseNodeData, FontSize, NodeContent } from './types';
import { NodeContentDialog } from './NodeContentDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const getFontSize = (size: FontSize | undefined): number => {
  switch (size) {
    case 'xs': return 12;
    case 's': return 14;
    case 'm': return 16;
    case 'l': return 20;
    case 'xl': return 24;
    default: return 12;
  }
};

const getNodeStyle = (nodeType?: string) => {
  switch (nodeType) {
    case 'title':
      return 'bg-transparent';
    case 'topic':
      return 'bg-yellow-300 border border-yellow-400';
    case 'subtopic':
      return 'bg-[#f5e6d3] border border-[#e6d5c3]';
    case 'rectangle':
      return 'bg-white border border-gray-200';
    case 'diamond':
      return 'bg-white border border-gray-200 rotate-45';
    case 'circle':
      return 'bg-white border border-gray-200 rounded-full';
    default:
      return 'bg-white border border-gray-200';
  }
};

export const BaseNode = ({ data, id, selected }: MindMapNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data?.label || '');
  const [nodeData, setNodeData] = useState<BaseNodeData>(data || { label: '' });
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [newContent, setNewContent] = useState<Partial<NodeContent>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (data) {
      setNodeData(data);
      setLabel(data.label);
    }
  }, [data]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    window.mindmapApi?.updateNodeData(id, { label });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      window.mindmapApi?.updateNodeData(id, { label });
    }
  };

  const handleAddContent = () => {
    if (!newContent.type || !newContent.value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const content: NodeContent[] = nodeData.content || [];
    const updatedContent = [...content, newContent as NodeContent];
    window.mindmapApi?.updateNodeData(id, { content: updatedContent });
    setNewContent({});
    
    toast({
      title: "Success",
      description: "Content added successfully",
    });
  };

  if (!nodeData) return null;

  const nodeStyle = getNodeStyle(nodeData.nodeType);
  const isDiamond = nodeData.nodeType === 'diamond';
  const isCircle = nodeData.nodeType === 'circle';
  const fontSize = getFontSize(nodeData.fontSize as FontSize);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={`min-w-[100px] min-h-[100px] ${nodeStyle} 
                     flex items-center justify-center relative cursor-pointer
                     ${nodeData.nodeType !== 'title' ? 'hover:border-mindmap-node-selected' : ''}`}
          style={{
            backgroundColor: nodeData.backgroundColor,
            borderColor: nodeData.strokeColor,
            borderWidth: nodeData.strokeWidth,
            borderStyle: nodeData.strokeStyle,
            opacity: nodeData.opacity || 1,
            textAlign: nodeData.textAlign || 'center',
            transform: isDiamond ? 'rotate(45deg)' : 'none',
            aspectRatio: isCircle ? '1 / 1' : 'auto',
            padding: '4px',
          }}
          onDoubleClick={handleDoubleClick}
          onClick={() => setShowContentDialog(true)}
        >
          {nodeData.nodeType !== 'title' && (
            <NodeResizer 
              minWidth={100}
              minHeight={isCircle ? 100 : 40}
              isVisible={selected}
              lineClassName="border-mindmap-primary"
              handleClassName="h-3 w-3 bg-white border-2 border-mindmap-primary rounded"
              keepAspectRatio={isCircle}
            />
          )}
          
          <NodeConnectors />

          <div 
            style={{ 
              transform: isDiamond ? 'rotate(-45deg)' : 'none',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isEditing ? (
              <Textarea
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="bg-transparent text-center outline-none w-full resize-none p-2 leading-normal"
                autoFocus
                style={{ 
                  fontSize: `${fontSize}px`,
                  fontFamily: nodeData.fontFamily,
                  lineHeight: '1.5'
                }}
              />
            ) : (
              <div 
                className="w-full p-2 whitespace-pre-wrap break-words leading-normal"
                style={{ 
                  fontSize: `${fontSize}px`,
                  fontFamily: nodeData.fontFamily
                }}
              >
                {label}
                {nodeData.content && nodeData.content.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Click to view attached content ({nodeData.content.length})
                  </div>
                )}
              </div>
            )}
          </div>
          
          {selected && (
            <>
              <NodeSettings data={nodeData} nodeId={id} />
              <div className="absolute bottom-0 left-0 -translate-y-full bg-white p-2 rounded-md shadow-lg border">
                <div className="space-y-2">
                  <select 
                    value={newContent.type || ''} 
                    onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as 'link' | 'text' }))}
                    className="w-full p-1 text-sm border rounded"
                  >
                    <option value="">Select type...</option>
                    <option value="link">Link</option>
                    <option value="text">Text</option>
                  </select>
                  <Input
                    placeholder="Title (optional)"
                    value={newContent.title || ''}
                    onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Content value"
                    value={newContent.value || ''}
                    onChange={(e) => setNewContent(prev => ({ ...prev, value: e.target.value }))}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={handleAddContent} className="w-full">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Content
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => window.mindmapApi?.deleteNode(id)}>
          Delete Node
        </ContextMenuItem>
      </ContextMenuContent>

      <NodeContentDialog
        isOpen={showContentDialog}
        onClose={() => setShowContentDialog(false)}
        content={nodeData.content}
        nodeLabel={label}
      />
    </ContextMenu>
  );
};
