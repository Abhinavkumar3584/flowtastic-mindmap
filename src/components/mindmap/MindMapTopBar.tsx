
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Save, FileDown, FilePlus, FileText, Trash2, ChevronDown, Undo, Redo } from 'lucide-react';
import { getAllMindMaps } from '@/utils/mindmapStorage';
import { useToast } from '@/hooks/use-toast';

interface MindMapTopBarProps {
  currentMindMap: string;
  saveCurrentMindMap: () => void;
  handleExport: () => void;
  createNewMindMap: (name: string) => void;
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
  const [newMapName, setNewMapName] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { toast } = useToast();
  const existingMaps = getAllMindMaps();

  const handleCreateNew = () => {
    if (newMapName.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please enter a name for your mind map',
        variant: 'destructive',
      });
      return;
    }

    if (existingMaps.includes(newMapName)) {
      toast({
        title: 'Error',
        description: 'A mind map with this name already exists',
        variant: 'destructive',
      });
      return;
    }

    createNewMindMap(newMapName);
    setNewMapName('');
    setIsCreatingNew(false);
  };

  return (
    <div className="flex items-center p-2 border-b bg-white">
      <div className="flex items-center space-x-2 flex-1">
        {isCreatingNew ? (
          <div className="flex items-center space-x-2">
            <Input
              value={newMapName}
              onChange={(e) => setNewMapName(e.target.value)}
              placeholder="Enter mind map name"
              className="w-40"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateNew();
                } else if (e.key === 'Escape') {
                  setIsCreatingNew(false);
                  setNewMapName('');
                }
              }}
              autoFocus
            />
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleCreateNew}
            >
              Create
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setIsCreatingNew(false);
                setNewMapName('');
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <FileText className="h-4 w-4 mr-1" />
                {currentMindMap || 'Untitled Mind Map'}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuItem 
                onClick={() => setIsCreatingNew(true)}
                className="cursor-pointer"
              >
                <FilePlus className="h-4 w-4 mr-2" />
                New Mind Map
              </DropdownMenuItem>
              
              {existingMaps.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="text-xs px-2 py-1 text-muted-foreground">
                    Open Existing Mind Map
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {existingMaps.map((map) => (
                      <DropdownMenuItem 
                        key={map} 
                        onClick={() => loadExistingMindMap(map)}
                        className="cursor-pointer flex justify-between items-center"
                      >
                        <span className="flex-1 truncate">{map}</span>
                        {map !== currentMindMap && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMindMap(map);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={saveCurrentMindMap}
          title="Save (Ctrl+S)"
          disabled={!currentMindMap}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExport}
          title="Export"
          disabled={!currentMindMap}
        >
          <FileDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
