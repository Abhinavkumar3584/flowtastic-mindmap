
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Save, 
  FolderOpen, 
  Download, 
  FilePlus, 
  ChevronDown, 
  Trash2,
  Settings,
  Undo,
  Redo,
  BookOpen,
  Eye
} from 'lucide-react';
import { getAllMindMaps } from '@/utils/mindmapStorage';
import { useToast } from '@/hooks/use-toast';
import { AutoSaveSettings } from './AutoSaveSettings';
import { AutoSaveConfig } from '@/utils/mindmapAutoSave';

interface MindMapTopBarProps {
  currentMindMap: string;
  onSave: () => void;
  handleExport: () => void;
  createNewMindMap: () => void;
  loadExistingMindMap: (name: string) => void;
  handleDeleteMindMap: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  autoSaveConfig: AutoSaveConfig;
  onAutoSaveConfigChange: (config: AutoSaveConfig) => void;
}

export const MindMapTopBar = ({
  currentMindMap,
  onSave,
  handleExport,
  createNewMindMap,
  loadExistingMindMap,
  handleDeleteMindMap,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  autoSaveConfig,
  onAutoSaveConfigChange
}: MindMapTopBarProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [autoSaveDialogOpen, setAutoSaveDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const existingMaps = getAllMindMaps();

  const handleCreateClick = () => {
    createNewMindMap();
  };

  return (
    <>
      <div className="bg-white shadow-sm border-b p-2 flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCreateClick} 
          className="gap-1"
        >
          <FilePlus className="h-4 w-4" />
          New
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSave} 
          className="gap-1"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport} 
          disabled={!currentMindMap} 
          className="gap-1"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <FolderOpen className="h-4 w-4" />
              Open <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {existingMaps.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-gray-500">
                No saved mind maps
              </div>
            ) : (
              existingMaps.map((name) => (
                <div key={name} className="flex items-center justify-between">
                  <DropdownMenuItem 
                    className="flex-1"
                    onClick={() => loadExistingMindMap(name)}
                  >
                    {name}
                  </DropdownMenuItem>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDeleteMindMap(name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Undo/Redo Buttons */}
        <div className="border-l mx-1 h-6"></div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onUndo} 
          disabled={!canUndo} 
          title="Undo"
          className="px-2"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRedo} 
          disabled={!canRedo} 
          title="Redo"
          className="px-2"
        >
          <Redo className="h-4 w-4" />
        </Button>
        
        {/* Auto-save settings */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setAutoSaveDialogOpen(true)}
          title="Auto-save Settings"
          className="px-2"
        >
          <Settings className="h-4 w-4" />
        </Button>        
        {/* Browse Exams Button */}
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open('/exams', '_blank')}
          title="Browse Exams"
          className="px-2 gap-1"
        >
          <BookOpen className="h-4 w-4" />
          <span>Browse</span>
        </Button>
        
        {/* View Mind Map Button */}
        <Button 
          variant="default" 
          size="sm"
          onClick={() => {
            if (currentMindMap) {
              window.open(`/view?map=${encodeURIComponent(currentMindMap)}`, '_blank');
            } else {
              alert('Please save the mind map first before viewing');
            }
          }}
          title="View Mind Map"
          className="px-2 gap-1 bg-blue-600 hover:bg-blue-700"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </Button>        
        <div className="ml-auto flex items-center gap-2">
          {autoSaveConfig.enabled && (
            <div className="text-xs px-2 py-1 bg-blue-100 rounded-full">
              Auto-save: {Math.floor(autoSaveConfig.interval / 1000)}s
            </div>
          )}
          <div className="text-sm font-medium">
            {currentMindMap ? `Current: ${currentMindMap}` : 'Unsaved mind map'}
          </div>
        </div>
      </div>

      {/* Auto-save Settings Dialog */}
      <AutoSaveSettings
        open={autoSaveDialogOpen}
        onOpenChange={setAutoSaveDialogOpen}
        config={autoSaveConfig}
        onConfigChange={onAutoSaveConfigChange}
      />
    </>
  );
};
