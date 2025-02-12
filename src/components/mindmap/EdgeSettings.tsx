
import React from 'react';
import { useReactFlow, MarkerType } from '@xyflow/react';
import { ChromePicker } from 'react-color';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EdgeData } from './types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const EdgeSettings = () => {
  const { getEdges, setEdges } = useReactFlow();
  const edges = getEdges();
  const selectedEdge = edges.find(edge => edge.selected);

  if (!selectedEdge) return null;

  const updateEdge = (updates: Partial<EdgeData>) => {
    setEdges(edges.map(edge => {
      if (edge.id === selectedEdge.id) {
        const newEdge = { ...edge };

        if ('style' in updates) {
          newEdge.style = { ...newEdge.style, ...updates.style };
        }
        if ('markerStart' in updates) {
          newEdge.markerStart = updates.markerStart;
        }
        if ('markerEnd' in updates) {
          newEdge.markerEnd = updates.markerEnd;
        }
        if ('animated' in updates) {
          newEdge.animated = updates.animated;
        }
        if ('type' in updates) {
          newEdge.type = updates.type;
        }

        window.mindmapApi?.updateEdge(edge.id, updates);
        return newEdge;
      }
      return edge;
    }));
  };

  const getStrokeStyle = () => {
    const dashArray = selectedEdge.style?.strokeDasharray;
    if (!dashArray) return 'solid';
    if (dashArray === '5,5') return 'dashed';
    if (dashArray === '2,2') return 'dotted';
    return 'solid';
  };

  const getArrowStyle = () => {
    const start = selectedEdge.markerStart?.type === MarkerType.Arrow;
    const end = selectedEdge.markerEnd?.type === MarkerType.Arrow;
    if (start && end) return 'both';
    if (start) return 'start';
    if (end) return 'end';
    return 'none';
  };

  return (
    <Card className="absolute right-4 top-20 w-64 z-50 bg-background border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Edge Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Color</Label>
          <Popover>
            <PopoverTrigger asChild>
              <div 
                className="w-8 h-8 rounded border cursor-pointer"
                style={{ backgroundColor: selectedEdge.style?.stroke || '#000000' }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" side="left">
              <ChromePicker
                color={selectedEdge.style?.stroke || '#000000'}
                onChange={(color) => updateEdge({ 
                  style: { stroke: color.hex } 
                })}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Stroke Style</Label>
          <Select
            value={getStrokeStyle()}
            onValueChange={(value) => {
              const strokeDasharray = value === 'dashed' ? '5,5' : 
                                    value === 'dotted' ? '2,2' : 
                                    undefined;
              updateEdge({ 
                style: { strokeDasharray } 
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Arrow Style</Label>
          <Select
            value={getArrowStyle()}
            onValueChange={(value) => {
              updateEdge({
                markerStart: value === 'start' || value === 'both' 
                  ? { type: MarkerType.Arrow }
                  : undefined,
                markerEnd: value === 'end' || value === 'both'
                  ? { type: MarkerType.Arrow }
                  : undefined,
              });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="start">Start</SelectItem>
              <SelectItem value="end">End</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Path Style</Label>
          <Select
            value={selectedEdge.type || 'default'}
            onValueChange={(value) => {
              updateEdge({ type: value });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Straight</SelectItem>
              <SelectItem value="smoothstep">Curved</SelectItem>
              <SelectItem value="step">Angular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
