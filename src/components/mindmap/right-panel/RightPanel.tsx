
import React from 'react';
import { X } from 'lucide-react';
import { useRightPanel } from '@/utils/rightPanelManager';
import { Button } from '@/components/ui/button';
import { ActionNodeEditor } from './ActionNodeEditor';
import { NoteNodeEditor } from './NoteNodeEditor';
import { ImageNodeEditor } from './ImageNodeEditor';
import { ProcessNodeEditor } from './ProcessNodeEditor';
import { ConceptNodeEditor } from './ConceptNodeEditor';

export const RightPanel: React.FC = () => {
  const { isOpen, activeNodeId, activeNodeType, closePanel } = useRightPanel();

  if (!isOpen || !activeNodeId) return null;

  const renderEditor = () => {
    switch (activeNodeType) {
      case 'action':
        return <ActionNodeEditor nodeId={activeNodeId} />;
      case 'note':
        return <NoteNodeEditor nodeId={activeNodeId} />;
      case 'image':
        return <ImageNodeEditor nodeId={activeNodeId} />;
      case 'process':
        return <ProcessNodeEditor nodeId={activeNodeId} />;
      case 'concept':
        return <ConceptNodeEditor nodeId={activeNodeId} />;
      default:
        return <div className="p-4">No editor available for this node type</div>;
    }
  };

  return (
    <div className="fixed right-0 top-14 bottom-0 w-80 bg-white shadow-xl border-l border-gray-200 z-10 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">
          {activeNodeType ? activeNodeType.charAt(0).toUpperCase() + activeNodeType.slice(1) : ''} Editor
        </h3>
        <Button variant="ghost" size="icon" onClick={closePanel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderEditor()}
      </div>
    </div>
  );
};
