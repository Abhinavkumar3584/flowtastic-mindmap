
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dropdown,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Save, 
  FilePlus, 
  FileUp, 
  Download, 
  MoreHorizontal, 
  Trash, 
  Undo2, 
  Redo2 
} from 'lucide-react';
import { getAllMindMaps } from '@/utils/mindmapStorage';

interface MindMapTopBarProps {
  currentMindMap: string;
  saveCurrentMindMap: () => void;
  handleExport: () => void;
  createNewMindMap: () => void;
  loadExistingMindMap: (name: string) => void;
  handleDeleteMindMap: (name: string) => void;
  handleUndo: () => void;
  handleRedo: () => void;
}

export const MindMapTopBar: React.FC<MindMapTopBarProps> = ({
  currentMindMap,
  saveCurrentMindMap,
  handleExport,
  createNewMindMap,
  loadExistingMindMap,
  handleDeleteMindMap,
  handleUndo,
  handleRedo
}) => {
  const [mindMaps, setMindMaps] = useState<string[]>([]);

  const handleOpenMindMapDropdown = () => {
    const maps = getAllMindMaps();
    setMindMaps(maps);
  };

  return (
    <div className="flex items-center justify-between p-2 border-b bg-white">
      <div className="flex items-center">
        <Button variant="default" size="sm" onClick={saveCurrentMindMap} className="mr-2">
          <Save className="h-4 w-4 mr-1" />
          Save{currentMindMap ? '' : ' As'}
        </Button>
        <Button variant="outline" size="sm" onClick={createNewMindMap} className="mr-2">
          <FilePlus className="h-4 w-4 mr-1" />
          New
        </Button>
        
        <Dropdown>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" onClick={handleOpenMindMapDropdown}>
              <FileUp className="h-4 w-4 mr-1" />
              Open
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Open Mind Map</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mindMaps.length === 0 ? (
              <DropdownMenuItem disabled>No mind maps saved</DropdownMenuItem>
            ) : (
              mindMaps.map((name) => (
                <DropdownMenuItem key={name} onClick={() => loadExistingMindMap(name)}>
                  {name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMindMap(name);
                    }}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </Dropdown>
      </div>

      <div className="text-lg font-medium">
        {currentMindMap || 'Untitled Mind Map'}
      </div>

      <div className="flex items-center">
        {/* Undo/Redo buttons */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUndo} 
          className="mr-2"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRedo} 
          className="mr-2"
          title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport} 
          className="mr-2"
          disabled={!currentMindMap}
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
        <Dropdown>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExport} disabled={!currentMindMap}>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport} disabled={!currentMindMap}>
              Export as Image
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Clear Canvas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </Dropdown>
      </div>
    </div>
  );
};
