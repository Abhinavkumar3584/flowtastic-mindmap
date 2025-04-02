
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';

interface ExportButtonProps {
  currentMindMap: string;
  onExport: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ currentMindMap, onExport }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onExport}
      disabled={!currentMindMap}
    >
      <FileUp className="h-4 w-4 mr-1" />
      Export
    </Button>
  );
};
