
import React, { useCallback } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EdgeData } from './types';
import { 
  Minus, 
  StretchHorizontal, 
  DotCircleHorizontal, 
  ChevronDown, 
  Palette 
} from 'lucide-react';

interface EdgeSettingsProps {
  id: string;
  data: EdgeData;
}

export function EdgeSettings({ id, data }: EdgeSettingsProps) {
  const handleStrokeWidthChange = useCallback((value: number[]) => {
    window.mindmapApi?.updateEdge(id, { strokeWidth: value[0] });
  }, [id]);

  const handleStrokeStyleChange = useCallback((style: string) => {
    window.mindmapApi?.updateEdge(id, { strokeStyle: style as 'solid' | 'dashed' | 'dotted' });
  }, [id]);

  const handleArrowChange = useCallback((position: 'start' | 'end', checked: boolean) => {
    if (position === 'start') {
      window.mindmapApi?.updateEdge(id, { arrowStart: checked });
    } else {
      window.mindmapApi?.updateEdge(id, { arrowEnd: checked });
    }
  }, [id]);

  const handleColorChange = useCallback((color: string) => {
    window.mindmapApi?.updateEdge(id, { strokeColor: color });
  }, [id]);

  return (
    <Card className="absolute bottom-4 right-4 w-72 shadow-lg z-10">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Line Width</Label>
            <Slider
              defaultValue={[data.strokeWidth || 1]}
              max={5}
              min={1}
              step={1}
              onValueChange={handleStrokeWidthChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Arrow Start</Label>
            <Switch 
              checked={data.arrowStart || false}
              onCheckedChange={(checked) => handleArrowChange('start', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Arrow End</Label>
            <Switch 
              checked={data.arrowEnd || false}
              onCheckedChange={(checked) => handleArrowChange('end', checked)}
            />
          </div>

          <div className="flex justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" /> 
                  Color
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>Line Color</DropdownMenuLabel>
                <div className="grid grid-cols-4 gap-1 p-2">
                  {['black', 'red', 'blue', 'green', 'orange', 'purple', 'pink', 'grey'].map((color) => (
                    <div
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 rounded-full cursor-pointer"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Minus className="h-4 w-4" /> 
                  Style
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>Stroke Style</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleStrokeStyleChange('solid')} className="flex items-center gap-2">
                  <Minus className="h-4 w-4" />
                  <span>Solid</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStrokeStyleChange('dashed')} className="flex items-center gap-2">
                  <StretchHorizontal className="h-4 w-4" />
                  <span>Dashed</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStrokeStyleChange('dotted')} className="flex items-center gap-2">
                  <DotCircleHorizontal className="h-4 w-4" />
                  <span>Dotted</span>
                </DropdownMenuItem>
                
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
