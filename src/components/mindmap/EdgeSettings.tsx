
import { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { EdgeData } from './types';
import { 
  Minus, 
  StretchHorizontal, 
  DotPattern, 
  ChevronDown, 
  Palette 
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface EdgeSettingsProps {
  id: string;
  data: EdgeData;
}

export const EdgeSettings = ({ id, data }: EdgeSettingsProps) => {
  const [edgeData, setEdgeData] = useState<EdgeData>(data);
  
  useEffect(() => {
    setEdgeData(data);
  }, [data]);
  
  const handleStrokeWidthChange = (value: number[]) => {
    const newData = { ...edgeData, strokeWidth: value[0] };
    setEdgeData(newData);
    window.mindmapApi?.updateEdge(id, newData);
  };
  
  const handleStrokeStyleChange = (style: 'solid' | 'dashed' | 'dotted') => {
    const newData = { ...edgeData, strokeStyle: style };
    setEdgeData(newData);
    window.mindmapApi?.updateEdge(id, newData);
  };
  
  const handleStrokeColorChange = (color: string) => {
    const newData = { ...edgeData, strokeColor: color };
    setEdgeData(newData);
    window.mindmapApi?.updateEdge(id, newData);
  };
  
  const handleArrowChange = (startOrEnd: 'start' | 'end', enabled: boolean) => {
    const newData = { 
      ...edgeData,
      arrowStart: startOrEnd === 'start' ? enabled : edgeData.arrowStart,
      arrowEnd: startOrEnd === 'end' ? enabled : edgeData.arrowEnd
    };
    setEdgeData(newData);
    window.mindmapApi?.updateEdge(id, newData);
  };
  
  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-md p-2 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center justify-between w-full mb-2">
            <span>Line Style</span>
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
            <DotPattern className="h-4 w-4" />
            <span>Dotted</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Arrows</DropdownMenuLabel>
          <div className="px-2 py-1">
            <RadioGroup defaultValue={edgeData.arrowStart ? "yes" : "no"} onValueChange={(val) => handleArrowChange('start', val === 'yes')}>
              <div className="flex items-center space-x-2">
                <Label>Arrow Start:</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="yes" id="start-yes" />
                    <Label htmlFor="start-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="no" id="start-no" />
                    <Label htmlFor="start-no">No</Label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
          <div className="px-2 py-1">
            <RadioGroup defaultValue={edgeData.arrowEnd ? "yes" : "no"} onValueChange={(val) => handleArrowChange('end', val === 'yes')}>
              <div className="flex items-center space-x-2">
                <Label>Arrow End:</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="yes" id="end-yes" />
                    <Label htmlFor="end-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="no" id="end-no" />
                    <Label htmlFor="end-no">No</Label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs">Line Width</span>
          <span className="text-xs">{edgeData.strokeWidth || 1}px</span>
        </div>
        <Slider 
          defaultValue={[edgeData.strokeWidth || 1]} 
          min={1} 
          max={10} 
          step={1} 
          onValueChange={handleStrokeWidthChange} 
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full flex items-center justify-between">
            <span>Line Color</span>
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: edgeData.strokeColor || '#000000' }} 
              />
              <Palette className="h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-5 gap-2">
            {[
              '#000000', '#FF5757', '#FFD166', '#06D6A0', '#118AB2', 
              '#073B4C', '#7209B7', '#4361EE', '#4CC9F0', '#F72585'
            ].map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ backgroundColor: color }}
                onClick={() => handleStrokeColorChange(color)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
