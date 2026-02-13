import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Edit3, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp,
  Type,
  FileText,
  Info
} from 'lucide-react';

export interface MindMapHeaderData {
  title: string;
  description: string;
  subDetails: string;
}

interface MindMapHeaderProps {
  data: MindMapHeaderData;
  onChange: (data: MindMapHeaderData) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  readOnly?: boolean; // Add read-only prop for view mode
}

export const MindMapHeader = ({ 
  data, 
  onChange, 
  isCollapsed = false,
  onToggleCollapse,
  readOnly = false
}: MindMapHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<MindMapHeaderData>(data);

  const handleSave = () => {
    onChange(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  const handleChange = (field: keyof MindMapHeaderData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (isCollapsed) {
    return (
      <Card className="mx-4 mt-2 border-l-4 border-l-blue-500">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold truncate">
                {data.title || 'Untitled Mind Map'}
              </h3>
              {data.description && (
                <p className="text-sm text-gray-600 truncate">
                  {data.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="ml-2"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mt-2 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-700">Mind Map Details</span>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && !readOnly ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-1"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            ) : !readOnly ? (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="gap-1"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : null}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Title Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Title</label>
            </div>
            {isEditing ? (
              <Input
                value={editData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter mind map title"
                className="text-lg font-semibold"
              />
            ) : (
              <h1 className="text-xl font-bold text-gray-900">
                {data.title || 'Untitled Mind Map'}
              </h1>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Description</label>
            </div>
            {isEditing ? (
              <Textarea
                value={editData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter mind map description"
                rows={2}
                className="resize-none"
              />
            ) : (
              <p className="text-gray-700">
                {data.description || 'No description provided'}
              </p>
            )}
          </div>

          {/* Sub Details Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Sub Details</label>
            </div>
            {isEditing ? (
              <Textarea
                value={editData.subDetails}
                onChange={(e) => handleChange('subDetails', e.target.value)}
                placeholder="Enter additional details, tags, or metadata"
                rows={2}
                className="resize-none"
              />
            ) : (
              <p className="text-sm text-gray-600">
                {data.subDetails || 'No additional details'}
              </p>
            )}
          </div>
        </div>

        {/* Status/Metadata Bar */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Created: {new Date().toLocaleDateString()}</span>
            <span>Last edited: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};