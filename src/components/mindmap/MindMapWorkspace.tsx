
import { useCallback } from 'react';
import { useStore } from '@xyflow/react';
import { WORKSPACE_PADDING } from './WorkspaceConstants';

interface MindMapWorkspaceProps {
  visible: boolean;
  width: number;
}

export const MindMapWorkspace = ({ visible, width }: MindMapWorkspaceProps) => {
  // Get the viewport dimensions from ReactFlow
  const { height } = useStore((state) => ({
    height: state.height,
  }));

  // Calculate workspace position
  const getWorkspaceStyle = useCallback(() => {
    // Center the workspace horizontally in the viewport
    const workspaceX = 0;
    
    return {
      position: 'absolute' as const,
      top: 0,
      left: `${workspaceX}px`,
      width: `${width}px`,
      height: '100%',
      border: visible ? '2px dashed #aaa' : 'none',
      borderRadius: '8px',
      pointerEvents: 'none' as const,
      zIndex: 5,
      opacity: visible ? 0.8 : 0,
      transition: 'opacity 0.2s ease-in-out',
    };
  }, [visible, width, height]);

  return (
    <>
      <div style={getWorkspaceStyle()}>
        {/* Header label */}
        {visible && (
          <div 
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '4px 12px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#666',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              zIndex: 10,
            }}
          >
            Workspace Area - {width}px
          </div>
        )}
        
        {/* Inner padding guide */}
        {visible && (
          <div
            style={{
              position: 'absolute',
              top: `${WORKSPACE_PADDING}px`,
              left: `${WORKSPACE_PADDING}px`,
              width: `calc(100% - ${WORKSPACE_PADDING * 2}px)`,
              height: `calc(100% - ${WORKSPACE_PADDING * 2}px)`,
              border: '1px dotted #ccc',
              borderRadius: '6px',
              pointerEvents: 'none',
              zIndex: 6,
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                padding: '2px 8px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '4px',
                fontSize: '10px',
                color: '#888',
              }}
            >
              Safe Content Area
            </div>
          </div>
        )}
      </div>
    </>
  );
};
