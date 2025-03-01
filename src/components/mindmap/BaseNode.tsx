
import { useState, useEffect } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut
} from "@/components/ui/context-menu";
import { NodeSettings } from './NodeSettings';
import { NodeConnectors } from './NodeConnectors';
import { MindMapNodeProps, BaseNodeData, FontSize, LegendPosition } from './types';
import { FileText, Check, Copy, Trash2, Clipboard, Scissors, CopyPlus } from 'lucide-react';
import { NodeLabel } from './node-components/NodeLabel';
import { NodeContainer } from './node-components/NodeContainer';
import { Checkbox } from '@/components/ui/checkbox';

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
      return 'bg-[#E5DEFF] rounded-lg shadow-md';
    case 'topic':
      return 'bg-[#FEF7CD] border border-black/20 rounded';
    case 'subtopic':
      return 'bg-[#FDE1D3] border-2 border-black/20 rounded-lg';
    case 'section':
      return 'bg-transparent border-2 border-dashed border-black/40 rounded-lg';
    default:
      return 'bg-white border border-gray-200';
  }
};

export const BaseNode = ({ data, id, selected }: MindMapNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const [nodeData, setNodeData] = useState<BaseNodeData>(data);
  const [isChecked, setIsChecked] = useState(data.isChecked || false);

  useEffect(() => {
    if (data) {
      setNodeData(data);
      setLabel(data.label);
      setIsChecked(data.isChecked || false);
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

  const handleCopy = () => {
    window.mindmapApi?.copyNode?.(id);
  };

  const handlePaste = () => {
    window.mindmapApi?.pasteNode?.(id);
  };

  const handleDuplicate = () => {
    window.mindmapApi?.duplicateNode?.(id);
  };

  const handleDelete = () => {
    window.mindmapApi?.deleteNode(id);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    window.mindmapApi?.updateNodeData(id, { isChecked: checked });
  };

  const getLegendPosition = (position: LegendPosition): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: `2px solid ${nodeData.legend?.color || '#000000'}`,
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    };

    switch (position) {
      case 'left-top':
        return { ...base, left: '-10px', top: '-10px' };
      case 'left-center':
        return { ...base, left: '-10px', top: '50%', transform: 'translateY(-50%)' };
      case 'left-bottom':
        return { ...base, left: '-10px', bottom: '-10px' };
      case 'right-top':
        return { ...base, right: '-10px', top: '-10px' };
      case 'right-center':
        return { ...base, right: '-10px', top: '50%', transform: 'translateY(-50%)' };
      case 'right-bottom':
        return { ...base, right: '-10px', bottom: '-10px' };
      default:
        return base;
    }
  };

  if (!nodeData) return null;

  const hasContent = !!(nodeData.content?.title || nodeData.content?.description || (nodeData.content?.links && nodeData.content.links.length > 0));
  const nodeStyle = getNodeStyle(nodeData.nodeType);
  const fontSize = getFontSize(nodeData.fontSize as FontSize);
  const showCheckbox = nodeData.hasCheckbox && nodeData.nodeType !== 'title' && nodeData.nodeType !== 'section';

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <NodeContainer
          nodeStyle={nodeStyle}
          nodeData={nodeData}
          selected={selected}
          onDoubleClick={handleDoubleClick}
        >
          <NodeConnectors />
          
          {hasContent && (
            <div className="absolute top-1 right-1 text-gray-500">
              <FileText className="h-4 w-4" />
            </div>
          )}

          {nodeData.legend?.enabled && (
            <div style={getLegendPosition(nodeData.legend.position)}>
              <Check
                className="h-3 w-3"
                style={{ color: nodeData.legend.color }}
              />
            </div>
          )}

          <div className="w-full h-full flex items-center justify-center">
            {showCheckbox && (
              <div className="absolute left-2 top-2">
                <Checkbox 
                  checked={isChecked}
                  onCheckedChange={handleCheckboxChange}
                  className="h-4 w-4 mr-2"
                />
              </div>
            )}
            <NodeLabel
              label={label}
              fontSize={fontSize}
              fontFamily={nodeData.fontFamily}
              isEditing={isEditing}
              onLabelChange={setLabel}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          {selected && <NodeSettings data={nodeData} nodeId={id} />}
        </NodeContainer>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onSelect={handleCopy} className="flex items-center">
          <Copy className="h-4 w-4 mr-2" />
          Copy
          <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onSelect={handlePaste} className="flex items-center">
          <Clipboard className="h-4 w-4 mr-2" />
          Paste
          <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={handleDuplicate} className="flex items-center">
          <CopyPlus className="h-4 w-4 mr-2" />
          Duplicate
          <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={handleDelete} className="flex items-center text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
          <ContextMenuShortcut>Delete</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
