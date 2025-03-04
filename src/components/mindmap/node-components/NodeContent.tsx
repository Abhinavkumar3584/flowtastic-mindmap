
import { NodeCheckbox } from './NodeCheckbox';
import { NodeLabel } from './NodeLabel';
import { ContentIndicator } from './ContentIndicator';
import { LegendIndicator } from './LegendIndicator';
import { BaseNodeData } from '../types';
import { getFontSize } from '../utils/fontSizeUtils';

interface NodeContentProps {
  nodeData: BaseNodeData;
  id: string;
  label: string;
  isEditing: boolean;
  onLabelChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const NodeContent = ({
  nodeData,
  id,
  label,
  isEditing,
  onLabelChange,
  onBlur,
  onKeyDown
}: NodeContentProps) => {
  const hasContent = !!(nodeData.content?.title || nodeData.content?.description || (nodeData.content?.links && nodeData.content.links.length > 0));
  const fontSize = getFontSize(nodeData.fontSize as FontSize);
  const showCheckbox = nodeData.hasCheckbox && nodeData.nodeType !== 'title' && nodeData.nodeType !== 'section';
  const isChecked = nodeData.isChecked || false;

  const handleCheckboxChange = (checked: boolean) => {
    window.mindmapApi?.updateNodeData(id, { isChecked: checked });
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {hasContent && <ContentIndicator />}

      {nodeData.legend?.enabled && (
        <LegendIndicator 
          enabled={nodeData.legend.enabled}
          position={nodeData.legend.position}
          color={nodeData.legend.color}
        />
      )}

      {showCheckbox && (
        <NodeCheckbox 
          isChecked={isChecked} 
          onChange={handleCheckboxChange} 
        />
      )}

      <NodeLabel
        label={label}
        fontSize={fontSize}
        fontFamily={nodeData.fontFamily}
        isEditing={isEditing}
        onLabelChange={onLabelChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};
