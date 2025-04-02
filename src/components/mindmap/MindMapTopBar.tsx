
import React, { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Save, 
  Plus, 
  FolderOpen, 
  Trash2, 
  FileUp, 
  Undo2, 
  Redo2,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { AutoSaveSettings } from './AutoSaveSettings';
import { AutoSaveConfig } from '@/utils/mindmapAutoSave';
import { WorkspaceSettings } from './types';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface MindMapTopBarProps {
  currentMindMap: string;
  saveCurrentMindMap: () => void;
  handleExport: () => void;
  createNewMindMap: (name: string) => void;
  loadExistingMindMap: (name: string) => void;
  handleDeleteMindMap: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  autoSaveConfig: AutoSaveConfig;
  onAutoSaveConfigChange: (config: AutoSaveConfig) => void;
  workspaceSettings: WorkspaceSettings;
  onWorkspaceSettingsChange: (settings: WorkspaceSettings) => void;
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
  workspaceSettings,
  onWorkspaceSettingsChange
}) => {
  const [newMindMapName, setNewMindMapName] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loadExistingMaps, setLoadExistingMaps] = useState<string[]>([]);
  const [showWorkspaceSettings, setShowWorkspaceSettings] = useState(false);

  // Handlers for workspace settings
  const handleWidthChange = (value: number[]) => {
    onWorkspaceSettingsChange({
      ...workspaceSettings,
      width: value[0]
    });
  };

  const handleVisibilityChange = (visible: boolean) => {
    onWorkspaceSettingsChange({
      ...workspaceSettings,
      visible
    });
  };

  const handleEnforcementChange = (enforced: boolean) => {
    onWorkspaceSettingsChange({
      ...workspaceSettings,
      enforced
    });
  };

  // Load existing mind maps when dropdown is opened
  const handleLoadDropdownOpen = (open: boolean) => {
    if (open) {
      // Fetch existing mind maps
      const existingMaps = JSON.parse(localStorage.getItem('mindmaps') || '{}');
      setLoadExistingMaps(Object.keys(existingMaps));
    }
  };

  // Handle creating a new mind map
  const handleCreateNew = () => {
    if (newMindMapName.trim()) {
      createNewMindMap(newMindMapName.trim());
      setNewMindMapName('');
      setCreateDialogOpen(false);
    }
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-center bg-white/90 rounded-lg p-2 shadow-sm">
      <div className="flex items-center space-x-2">
        {/* New Mind Map Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>

        {/* Save Mind Map Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={saveCurrentMindMap}
          disabled={!currentMindMap}
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>

        {/* Open Mind Map Dropdown */}
        <DropdownMenu onOpenChange={handleLoadDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-1" />
              Open
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {loadExistingMaps.length > 0 ? (
              loadExistingMaps.map((name) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => loadExistingMindMap(name)}
                >
                  {name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No mind maps found</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Mind Map Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => currentMindMap && handleDeleteMindMap(currentMindMap)}
          disabled={!currentMindMap}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>

        {/* Export Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport}
          disabled={!currentMindMap}
        >
          <FileUp className="h-4 w-4 mr-1" />
          Export
        </Button>

        {/* Undo/Redo Buttons */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        
        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Auto-save
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <AutoSaveSettings 
                  config={autoSaveConfig} 
                  onChange={onAutoSaveConfigChange} 
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuItem onClick={() => setShowWorkspaceSettings(true)}>
              Workspace Settings
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Workspace Visibility
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup 
                  value={workspaceSettings.visible ? "visible" : "hidden"}
                  onValueChange={(value) => handleVisibilityChange(value === "visible")}
                >
                  <DropdownMenuRadioItem value="visible">
                    <Eye className="h-4 w-4 mr-2" />
                    Show Workspace
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="hidden">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Workspace
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Current Mind Map Name Display */}
      <div className="text-sm font-medium">
        {currentMindMap ? `Current: ${currentMindMap}` : 'No mind map loaded'}
      </div>

      {/* Create New Mind Map Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Mind Map</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 mt-4">
            <Input
              placeholder="Enter mind map name"
              value={newMindMapName}
              onChange={(e) => setNewMindMapName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateNew();
                }
              }}
            />
            <Button onClick={handleCreateNew} disabled={!newMindMapName.trim()}>
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Workspace Settings Dialog */}
      <Dialog open={showWorkspaceSettings} onOpenChange={setShowWorkspaceSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workspace Settings</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-6 mt-4">
            <div className="space-y-2">
              <Label>Workspace Width: {workspaceSettings.width}px</Label>
              <Slider
                value={[workspaceSettings.width]}
                onValueChange={handleWidthChange}
                min={400}
                max={1600}
                step={50}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="workspace-visible">Show Workspace Area</Label>
              <Switch
                id="workspace-visible"
                checked={workspaceSettings.visible}
                onCheckedChange={handleVisibilityChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="workspace-enforced">Enforce Workspace Boundaries</Label>
              <Switch
                id="workspace-enforced"
                checked={workspaceSettings.enforced}
                onCheckedChange={handleEnforcementChange}
              />
            </div>
            
            <div className="text-sm text-gray-500">
              <p>
                The workspace area defines where your nodes should be placed for optimal
                export results. When enforcement is enabled, nodes will be automatically kept
                within the workspace boundaries.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
