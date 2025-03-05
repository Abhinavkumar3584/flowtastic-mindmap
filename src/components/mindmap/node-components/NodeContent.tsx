
import { useState, useRef, useEffect } from 'react';
import { BaseNodeData } from '../types';

interface NodeContentProps {
  nodeData: BaseNodeData;
  id: string;
  label: string;
  isEditing: boolean;
  onLabelChange: (label: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const NodeContent: React.FC<NodeContentProps> = ({
  nodeData,
  id,
  label,
  isEditing,
  onLabelChange,
  onBlur,
  onKeyDown,
}) => {
  const [editValue, setEditValue] = useState(label);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
    onLabelChange(e.target.value);
  };

  const getFontClassName = (fontSize?: 'xs' | 's' | 'm' | 'l' | 'xl') => {
    switch (fontSize) {
      case 'xs': return 'text-xs';
      case 's': return 'text-sm';
      case 'l': return 'text-lg';
      case 'xl': return 'text-xl';
      case 'm':
      default: return 'text-base';
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={editValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="w-full h-full bg-transparent outline-none resize-none text-center"
        style={{
          fontFamily: nodeData.fontFamily,
          fontSize: nodeData.fontSize,
        }}
      />
    );
  }

  return (
    <div 
      className={`text-center break-words ${getFontClassName(nodeData.fontSize)}`}
      style={{
        fontFamily: nodeData.fontFamily,
        textAlign: nodeData.textAlign || 'center',
      }}
    >
      {label || 'New Node'}
    </div>
  );
};
