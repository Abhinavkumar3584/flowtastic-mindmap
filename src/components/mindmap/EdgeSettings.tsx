
import React from 'react';
import { useReactFlow, MarkerType } from '@xyflow/react';
import { ChromePicker } from 'react-color';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EdgeData } from './types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  Minus,
  LineStroke,
  StraightLine,
  CurvedLine,
  GitBranch,
  DotDashed,
  Waves,
  Bold,
  AlignJustify,
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const LINE_WEIGHTS = [1, 2, 3, 4];

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
        if ('type' in updates) {
          newEdge.type = updates.type;
        }

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

  const getLineWeight = () => {
    return selectedEdge.style?.strokeWidth || 1;
  };

  return (
    <Card className="absolute right-4 top-20 w-72 z-50 bg-background border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Edge Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
          <Label>Line Weight</Label>
          <ToggleGroup 
            type="single" 
            value={getLineWeight().toString()}
            onValueChange={(value) => {
              if (value) {
                updateEdge({ 
                  style: { strokeWidth: parseInt(value) } 
                });
              }
            }}
            className="justify-start"
          >
            {LINE_WEIGHTS.map((weight) => (
              <ToggleGroupItem 
                key={weight} 
                value={weight.toString()}
                className="p-2"
              >
                <LineStroke style={{ strokeWidth: weight }} />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label>Stroke Style</Label>
          <ToggleGroup 
            type="single" 
            value={getStrokeStyle()}
            onValueChange={(value) => {
              if (value) {
                const strokeDasharray = value === 'dashed' ? '5,5' : 
                                      value === 'dotted' ? '2,2' : 
                                      undefined;
                updateEdge({ 
                  style: { strokeDasharray } 
                });
              }
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="solid">
              <Minus className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="dashed">
              <DotDashed className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="dotted">
              <Waves className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label>Arrow Style</Label>
          <ToggleGroup 
            type="single" 
            value={getArrowStyle()}
            onValueChange={(value) => {
              if (value) {
                updateEdge({
                  markerStart: value === 'start' || value === 'both' 
                    ? { type: MarkerType.Arrow }
                    : undefined,
                  markerEnd: value === 'end' || value === 'both'
                    ? { type: MarkerType.Arrow }
                    : undefined,
                });
              }
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="none">
              <Minus className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="start">
              <ArrowLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="end">
              <ArrowRight className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="both">
              <ArrowLeftRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label>Path Style</Label>
          <ToggleGroup 
            type="single" 
            value={selectedEdge.type || 'default'}
            onValueChange={(value) => {
              if (value) {
                updateEdge({ type: value });
              }
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="default">
              <StraightLine className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="smoothstep">
              <CurvedLine className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="step">
              <GitBranch className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
};
