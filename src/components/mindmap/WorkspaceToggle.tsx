
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutTemplate, Eye, EyeOff } from 'lucide-react';
import { WorkspaceConfig } from './types';

interface WorkspaceToggleProps {
  workspace: WorkspaceConfig;
  onToggleWorkspace: () => void;
  onToggleWorkspaceVisibility: () => void;
}

export const WorkspaceToggle: React.FC<WorkspaceToggleProps> = ({
  workspace,
  onToggleWorkspace,
  onToggleWorkspaceVisibility,
}) => {
  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleWorkspace}
              className={workspace.enabled ? 'bg-blue-100' : ''}
            >
              <LayoutTemplate className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{workspace.enabled ? 'Disable' : 'Enable'} workspace</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {workspace.enabled && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleWorkspaceVisibility}
              >
                {workspace.visible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{workspace.visible ? 'Hide' : 'Show'} workspace boundary</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
