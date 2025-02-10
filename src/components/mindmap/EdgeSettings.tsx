
import React from 'react';
import { useReactFlow } from '@xyflow/react';
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
  const { getEdges, getSelectedEdges } = useReactFlow();
  const selectedEdges = getSelectedEdges();

  if (selectedEdges.length === 0) return null;

  const edge = selectedEdges[0];
  const data = edge.data || {};

  const updateEdge = (newData: Partial<EdgeData>) => {
    window.mindmapApi?.updateEdgeData(edge.id, newData);
  };

  return (
    <Card className="absolute right-4 top-20 w-64 z-50 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Edge Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Color</Label>
          <Popover>
            <PopoverTrigger asChild>
              <div 
                className="w-8 h-8 rounded border cursor-pointer"
                style={{ backgroundColor: data.strokeColor || '#000000' }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <ChromePicker
                color={data.strokeColor || '#000000'}
                onChange={(color) => updateEdge({ strokeColor: color.hex })}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Stroke Style</Label>
          <Select
            value={data.strokeStyle || 'solid'}
            onValueChange={(value: 'solid' | 'dashed' | 'dotted') => updateEdge({ strokeStyle: value })}
          >
            <SelectTrigger>
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
            value={`${data.arrowStart ? '1' : '0'}${data.arrowEnd ? '1' : '0'}`}
            onValueChange={(value) => {
              updateEdge({
                arrowStart: value.charAt(0) === '1',
                arrowEnd: value.charAt(1) === '1',
              });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="00">None</SelectItem>
              <SelectItem value="01">End</SelectItem>
              <SelectItem value="10">Start</SelectItem>
              <SelectItem value="11">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Path Style</Label>
          <Select
            value={data.pathStyle || 'straight'}
            onValueChange={(value: 'straight' | 'curved' | 'step') => updateEdge({ pathStyle: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="straight">Straight</SelectItem>
              <SelectItem value="curved">Curved</SelectItem>
              <SelectItem value="step">Step</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
