
import { useState, useCallback } from 'react';
import { Connection, MarkerType, addEdge } from '@xyflow/react';
import { EdgeData, OnEdgeClick, MindMapEdge } from '../types';

interface UseMindMapEdgeHandlersProps {
  setEdges: React.Dispatch<React.SetStateAction<MindMapEdge[]>>;
}

export const useMindMapEdgeHandlers = ({ setEdges }: UseMindMapEdgeHandlersProps) => {
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  // Edge update function
  const updateEdge = useCallback((id: string, newData: Partial<EdgeData>) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          const markerEnd = newData.arrowEnd !== undefined ? 
            (newData.arrowEnd ? { type: MarkerType.ArrowClosed } : undefined) :
            edge.markerEnd;

          const markerStart = newData.arrowStart !== undefined ? 
            (newData.arrowStart ? { type: MarkerType.ArrowClosed } : undefined) :
            edge.markerStart;

          // Define edge type based on pathStyle
          let type = edge.type;
          if (newData.pathStyle) {
            switch (newData.pathStyle) {
              case 'straight': type = 'default'; break;
              case 'curved': type = 'bezier'; break;
              case 'step': type = 'step'; break;
              case 'smoothstep': type = 'smoothstep'; break;
              // Custom types would need custom implementations
              case 'loopback': type = 'bezier'; break; 
              case 'zigzag': type = 'step'; break;
              case 'wavy': type = 'bezier'; break;
              default: type = 'default';
            }
          }

          return {
            ...edge,
            type,
            markerEnd,
            markerStart,
            data: {
              ...edge.data,
              ...newData,
            },
            style: {
              ...edge.style,
              stroke: newData.strokeColor || edge.style?.stroke,
              strokeWidth: newData.strokeWidth || edge.style?.strokeWidth,
              strokeDasharray: newData.strokeStyle === 'dashed' ? '5,5' : 
                               newData.strokeStyle === 'dotted' ? '1,5' : 
                               undefined
            }
          };
        }
        return edge;
      })
    );
  }, [setEdges]);

  // Edge connection handler
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            data: {
              strokeStyle: 'solid',
              strokeWidth: 1,
              strokeColor: '#000000',
              arrowEnd: true,
              pathStyle: 'smoothstep'
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // Edge click handler
  const onEdgeClick: OnEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdge(selectedEdge === edge.id ? null : edge.id);
  }, [selectedEdge]);

  return {
    selectedEdge,
    updateEdge,
    onConnect,
    onEdgeClick
  };
};
