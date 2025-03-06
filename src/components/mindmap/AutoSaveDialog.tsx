
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { autoSaveManager } from '@/utils/autoSave';
import { SaveAll } from 'lucide-react';

interface AutoSaveDialogProps {
  mindMapName: string;
  onToggleAutoSave: (enabled: boolean) => void;
  onIntervalChange: (interval: number) => void;
}

export const AutoSaveDialog: React.FC<AutoSaveDialogProps> = ({
  mindMapName,
  onToggleAutoSave,
  onIntervalChange,
}) => {
  const config = autoSaveManager.getConfig();
  const [isEnabled, setIsEnabled] = useState(config.enabled);
  const [interval, setInterval] = useState(config.interval / 1000); // Convert to seconds for UI
  const [open, setOpen] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    onToggleAutoSave(checked);
  };

  const handleIntervalChange = (value: number[]) => {
    const newInterval = value[0];
    setInterval(newInterval);
    onIntervalChange(newInterval * 1000); // Convert to milliseconds
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-1">
          <SaveAll className="h-4 w-4" />
          Auto Save
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Auto Save Settings</DialogTitle>
          <DialogDescription>
            Configure automatic saving for your mind map.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save-toggle" className="text-sm font-medium">
              Enable Auto Save
            </Label>
            <Switch
              id="auto-save-toggle"
              checked={isEnabled}
              onCheckedChange={handleToggle}
            />
          </div>
          
          {isEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="save-interval" className="text-sm font-medium">
                  Save Interval: {interval} seconds
                </Label>
                <Slider
                  id="save-interval"
                  defaultValue={[interval]}
                  min={10}
                  max={300}
                  step={10}
                  onValueChange={handleIntervalChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10s</span>
                  <span>5m</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {mindMapName ? (
                  <p>Auto saving: <span className="font-semibold">{mindMapName}</span></p>
                ) : (
                  <p className="text-amber-500">Save your mind map first to enable auto-save.</p>
                )}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
