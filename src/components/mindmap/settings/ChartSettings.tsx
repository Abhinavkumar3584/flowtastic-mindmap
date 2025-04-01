
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BaseNodeData } from "../types";
import { Trash2, Plus, Palette } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface ChartSettingsProps {
  nodeId: string;
  data: BaseNodeData;
}

export const ChartSettings = ({ nodeId, data }: ChartSettingsProps) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area'>(
    data.chartType || 'bar'
  );
  const [chartData, setChartData] = useState<Array<{
    name: string;
    value: number;
    color?: string;
  }>>(
    data.chartData || [
      { name: 'Category A', value: 400, color: '#8884d8' },
      { name: 'Category B', value: 300, color: '#83a6ed' },
      { name: 'Category C', value: 300, color: '#8dd1e1' },
      { name: 'Category D', value: 200, color: '#82ca9d' },
    ]
  );
  const [showLegend, setShowLegend] = useState<boolean>(
    data.showLegend !== false
  );
  const [label, setLabel] = useState<string>(data.label || "Chart");

  // Apply changes when component unmounts
  useEffect(() => {
    return () => {
      saveChanges();
    };
  }, []);

  const saveChanges = () => {
    if (window.mindmapApi) {
      window.mindmapApi.updateNodeData(nodeId, {
        label,
        chartType,
        chartData,
        showLegend,
      });
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleChartTypeChange = (value: string) => {
    setChartType(value as 'bar' | 'line' | 'pie' | 'area');
    saveChanges();
  };

  const handleDataNameChange = (index: number, value: string) => {
    const newData = [...chartData];
    newData[index] = { ...newData[index], name: value };
    setChartData(newData);
  };

  const handleDataValueChange = (index: number, value: string) => {
    const numValue = parseInt(value, 10) || 0;
    const newData = [...chartData];
    newData[index] = { ...newData[index], value: numValue };
    setChartData(newData);
  };

  const handleDataColorChange = (index: number, color: string) => {
    const newData = [...chartData];
    newData[index] = { ...newData[index], color };
    setChartData(newData);
  };

  const addDataPoint = () => {
    const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#ffc658', '#ff8042'];
    const newIndex = chartData.length;
    const newColor = colors[newIndex % colors.length];
    
    setChartData([
      ...chartData, 
      { 
        name: `Category ${String.fromCharCode(65 + newIndex)}`, 
        value: 100, 
        color: newColor 
      }
    ]);
  };

  const removeDataPoint = (index: number) => {
    if (chartData.length <= 1) return;
    const newData = chartData.filter((_, i) => i !== index);
    setChartData(newData);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chart Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="chart-label">Chart Label</Label>
        <Input
          id="chart-label"
          value={label}
          onChange={handleLabelChange}
          onBlur={saveChanges}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chart-type">Chart Type</Label>
        <Select 
          value={chartType} 
          onValueChange={handleChartTypeChange}
        >
          <SelectTrigger id="chart-type">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="show-legend"
          checked={showLegend}
          onCheckedChange={(checked) => {
            setShowLegend(checked);
            saveChanges();
          }}
        />
        <Label htmlFor="show-legend">Show Legend</Label>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold">Data Points</h4>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={addDataPoint}
            className="h-7 gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Data Point
          </Button>
        </div>
        
        {chartData.map((dataPoint, index) => (
          <div key={index} className="space-y-2 p-2 border rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Point {index + 1}</span>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => removeDataPoint(index)}
                disabled={chartData.length <= 1}
                className="h-6 w-6"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-500" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`name-${index}`} className="text-xs">Name</Label>
                <Input
                  id={`name-${index}`}
                  value={dataPoint.name}
                  onChange={(e) => handleDataNameChange(index, e.target.value)}
                  onBlur={saveChanges}
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label htmlFor={`value-${index}`} className="text-xs">Value</Label>
                <Input
                  id={`value-${index}`}
                  type="number"
                  value={dataPoint.value}
                  onChange={(e) => handleDataValueChange(index, e.target.value)}
                  onBlur={saveChanges}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor={`color-${index}`} className="text-xs">Color</Label>
              <div className="flex-1 flex items-center gap-1 border rounded px-2 py-1">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: dataPoint.color || '#8884d8' }}
                ></div>
                <Input
                  id={`color-${index}`}
                  type="color"
                  value={dataPoint.color || '#8884d8'}
                  onChange={(e) => handleDataColorChange(index, e.target.value)}
                  onBlur={saveChanges}
                  className="w-full h-6 p-0 border-0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
