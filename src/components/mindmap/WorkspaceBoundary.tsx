
import { memo } from 'react';

// Workspace dimensions in flow coordinates
export const WORKSPACE_WIDTH = 800;
export const WORKSPACE_HEIGHT = 3000;
export const WORKSPACE_X = 0;
export const WORKSPACE_Y = 0;

interface WorkspaceBoundaryNodeProps {
  data: Record<string, unknown>;
}

export const WorkspaceBoundaryNode = memo(({ }: WorkspaceBoundaryNodeProps) => {
  return (
    <div
      style={{
        width: WORKSPACE_WIDTH,
        height: WORKSPACE_HEIGHT,
        border: '2px dashed hsl(var(--border))',
        borderRadius: 12,
        pointerEvents: 'none',
        backgroundColor: 'hsl(var(--background) / 0.3)',
      }}
    />
  );
});

WorkspaceBoundaryNode.displayName = 'WorkspaceBoundaryNode';
