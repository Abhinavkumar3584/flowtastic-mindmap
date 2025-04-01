
import React from 'react';
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, Save, Download, Plus, FolderOpen, Trash2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { AutoSaveSettings } from './AutoSaveSettings';
import { AutoSaveConfig } from '@/utils/mindmapAutoSave';

interface MindMapTopBarProps {
  currentMindMap: string;
  saveCurrentMindMap: () => void;
  handleExport: () => void;
  createNewMindMap: () => void;
  loadExistingMindMap: () => void;
  handleDeleteMindMap: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  autoSaveConfig: AutoSaveConfig;
  onAutoSaveConfigChange: (config: AutoSaveConfig) => void;
  extraButtons?: React.ReactNode;
}

export const MindMapTopBar: React.FC<MindMapTopBarProps> = ({
  currentMindMap,
  saveCurrentMindMap,
  handleExport,
  createNewMindMap,
  loadExistingMindMap,
  handleDeleteMindMap,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  autoSaveConfig,
  onAutoSaveConfigChange,
  extraButtons,
}) => {
  return (
    <div className="flex items-center p-2 gap-2 border-b bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={saveCurrentMindMap}
          disabled={!currentMindMap}
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport}
          disabled={!currentMindMap}
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={createNewMindMap}
        >
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadExistingMindMap}
        >
          <FolderOpen className="h-4 w-4 mr-1" />
          Load
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDeleteMindMap}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <AutoSaveSettings
        autoSaveConfig={autoSaveConfig}
        onAutoSaveConfigChange={onAutoSaveConfigChange}
      />

      {/* Display current mind map name if available */}
      {currentMindMap && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {currentMindMap}
          </div>
        </>
      )}
      
      {/* Extra buttons slot */}
      {extraButtons && (
        <>
          <Separator orientation="vertical" className="h-6" />
          {extraButtons}
        </>
      )}
    </div>
  );
};
