import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { BaseNodeData, FontSize } from '../types';

interface NodeLabelProps {
  label: string;
  fontSize: number;
  fontFamily?: string;
  isEditing: boolean;
  onLabelChange: (newLabel: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const NodeLabel = ({
  label,
  fontSize,
  fontFamily,
  isEditing,
  onLabelChange,
  onBlur,
  onKeyDown
}: NodeLabelProps) => {
  if (isEditing) {
    return (
      <Textarea
        value={label}
        onChange={(e) => onLabelChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="bg-transparent text-center outline-none w-full resize-none p-2 leading-normal"
        autoFocus
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily,
          lineHeight: '1.5'
        }}
      />
    );
  }

  return (
    <div 
      className="w-full p-2 whitespace-pre-wrap break-words leading-normal"
      style={{ 
        fontSize: `${fontSize}px`,
        fontFamily
      }}
    >
      {label}
    </div>
  );
};