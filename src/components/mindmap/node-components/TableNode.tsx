
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { NodeContainer } from './NodeContainer';
import { MindMapNodeProps } from '../types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TableSettings } from '../settings/TableSettings';

export const TableNode: React.FC<MindMapNodeProps> = ({ 
  id, 
  data, 
  selected 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  // Default table data if none exists
  const tableHeaders = data.tableHeaders || ['Header 1', 'Header 2', 'Header 3'];
  const tableData = data.tableData || [
    ['Cell 1', 'Cell 2', 'Cell 3'],
    ['Cell 4', 'Cell 5', 'Cell 6']
  ];
  const showHeaders = data.showHeaders !== false;

  return (
    <NodeContainer 
      nodeStyle="min-w-[240px] min-h-[120px] bg-white overflow-auto"
      nodeData={data}
      selected={selected}
      onDoubleClick={handleDoubleClick}
      forceAspectRatio={false}
    >
      <div className="w-full h-full p-1 relative">
        <div className="font-semibold text-sm mb-2 text-left px-1">{data.label || 'Table'}</div>
        
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
              <TableSettings nodeId={id} data={data} />
            </DialogContent>
          </Dialog>
        )}
        
        {/* Table display */}
        <div className="overflow-auto max-h-[180px]">
          <table className="w-full border-collapse">
            {showHeaders && (
              <thead>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th 
                      key={index} 
                      className="border border-gray-300 bg-gray-100 p-1 text-xs font-medium"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="border border-gray-200 p-1 text-xs truncate"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </NodeContainer>
  );
};
