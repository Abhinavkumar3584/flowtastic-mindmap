
import { useState, useEffect } from 'react';
import { MindMapNodeProps } from './types';
import { NodeContextMenu } from './node-components/NodeContextMenu';
import { NodeContent } from './node-components/NodeContent';
import { NodeContainer } from './node-components/NodeContainer';
import { SettingsButton } from './node-components/SettingsButton';
import { NodeSettings } from './NodeSettings';
import { getNodeStyle } from './utils/fontSizeUtils';

export const BaseNode = ({ data, id, selected }: MindMapNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '');
  const [nodeData, setNodeData] = useState(data);

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

  if (!nodeData) return null;

  const nodeStyle = getNodeStyle(nodeData.nodeType);

  return (
    <NodeContextMenu id={id}>
      <NodeContainer
        nodeStyle={nodeStyle}
        nodeData={nodeData}
        selected={selected}
        onDoubleClick={handleDoubleClick}
      >
        <NodeContent
          nodeData={nodeData}
          id={id}
          label={label}
          isEditing={isEditing}
          onLabelChange={setLabel}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
        
        {selected && (
          <SettingsButton onClick={() => {}} />
        )}
        {selected && <NodeSettings data={nodeData} nodeId={id} />}
      </NodeContainer>
    </NodeContextMenu>
  );
};
