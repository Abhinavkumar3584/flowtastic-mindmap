
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChartSettings } from '../settings/ChartSettings';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ChartNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  // Default chart data if none exists
  const chartData = data.chartData || [
    { name: 'Category A', value: 400, color: '#8884d8' },
    { name: 'Category B', value: 300, color: '#83a6ed' },
    { name: 'Category C', value: 300, color: '#8dd1e1' },
    { name: 'Category D', value: 200, color: '#82ca9d' },
  ];
  
  const chartType = data.chartType || 'bar';
  const showLegend = data.showLegend !== false;

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                dataKey="value"
                label={({ name }) => name}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {showLegend && <Legend />}
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
              {showLegend && <Legend />}
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
              {showLegend && <Legend />}
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              {showLegend && <Legend />}
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <NodeContainer 
      nodeStyle="min-w-[280px] min-h-[200px] bg-white"
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
      forceAspectRatio={false}
    >
      <div className="w-full h-full p-2 relative">
        <div className="font-semibold text-sm mb-2">{data.label || 'Chart'}</div>
        
        {/* Settings button in top right corner - only visible when selected */}
        {selected && (
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-white/70 hover:bg-white/90"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <ChartSettings nodeId={id} data={data} />
            </DialogContent>
          </Dialog>
        )}
        
        {/* Chart display */}
        <div className="mt-2">
          {renderChart()}
        </div>
      </div>
    </NodeContainer>
  );
};
