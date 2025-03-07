
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
import { Save, FolderOpen, Download, FilePlus, ChevronDown, Trash2 } from 'lucide-react';
import { getAllMindMaps } from '@/utils/mindmapStorage';
import { useToast } from '@/hooks/use-toast';

interface MindMapTopBarProps {
  currentMindMap: string;
  saveCurrentMindMap: () => void;
  handleExport: () => void;
  createNewMindMap: (name: string) => void;
  loadExistingMindMap: (name: string) => void;
  handleDeleteMindMap: (name: string) => void;
}

export const MindMapTopBar = ({
  currentMindMap,
  saveCurrentMindMap,
  handleExport,
  createNewMindMap,
  loadExistingMindMap,
  handleDeleteMindMap
}: MindMapTopBarProps) => {
  const [newMapName, setNewMapName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  
  const existingMaps = getAllMindMaps();

  const handleCreateClick = () => {
    if (isCreating && newMapName.trim()) {
      createNewMindMap(newMapName.trim());
      setNewMapName('');
      setIsCreating(false);
    } else {
      setIsCreating(true);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewMapName('');
  };

  const saveMap = () => {
    saveCurrentMindMap();
    toast({
      title: "Saved",
      description: `Mind map "${currentMindMap}" has been saved.`,
    });
  };

  return (
    <div className="bg-white shadow-sm border-b p-2 flex items-center gap-2">
      {isCreating ? (
        <div className="flex space-x-2 flex-1">
          <Input
            placeholder="Enter mind map name"
            value={newMapName}
            onChange={(e) => setNewMapName(e.target.value)}
            autoFocus
            className="max-w-64"
          />
          <Button size="sm" onClick={handleCreateClick} disabled={!newMapName.trim()}>
            Create
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      ) : (
        <>
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
            onClick={saveMap} 
            disabled={!currentMindMap} 
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
        </>
      )}
      
      <div className="ml-auto text-sm font-medium">
        {currentMindMap ? `Current: ${currentMindMap}` : 'Unsaved mind map'}
      </div>
    </div>
  );
};
