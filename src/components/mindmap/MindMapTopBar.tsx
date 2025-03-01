
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getAllMindMaps } from '@/utils/mindmapStorage';

interface MindMapTopBarProps {
  currentMindMap: string;
  saveCurrentMindMap: () => void;
  handleExport: () => void;
  createNewMindMap: () => void;
  loadExistingMindMap: (name: string) => void;
  handleDeleteMindMap: (name: string) => void;
}

export const MindMapTopBar: React.FC<MindMapTopBarProps> = ({
  currentMindMap,
  saveCurrentMindMap,
  handleExport,
  createNewMindMap,
  loadExistingMindMap,
  handleDeleteMindMap,
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <Button onClick={saveCurrentMindMap}>
        Save
      </Button>
      <Button onClick={handleExport} variant="outline">
        <Share2 className="mr-2 h-4 w-4" />
        Export
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Load Mind Map
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {getAllMindMaps().map((name) => (
            <DropdownMenuItem
              key={name}
              className="flex items-center justify-between group"
            >
              <span onClick={() => loadExistingMindMap(name)} className="flex-1 cursor-pointer">
                {name}
              </span>
              <Trash2
                className="h-4 w-4 text-destructive opacity-0 group-hover:opacity-100 cursor-pointer ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMindMap(name);
                }}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button onClick={createNewMindMap}>
        <Plus className="mr-2 h-4 w-4" />
        New
      </Button>
    </div>
  );
};
