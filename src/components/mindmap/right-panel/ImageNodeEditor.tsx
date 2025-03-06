
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ImageIcon } from 'lucide-react';

interface ImageNodeEditorProps {
  nodeId: string;
}

export const ImageNodeEditor: React.FC<ImageNodeEditorProps> = ({ nodeId }) => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [hasBorder, setHasBorder] = useState(true);
  const [aspectRatio, setAspectRatio] = useState<'auto' | 'square' | 'wide' | 'tall'>('auto');
  const [effect, setEffect] = useState<'none' | 'grayscale' | 'sepia' | 'blur'>('none');

  // Load node data
  useEffect(() => {
    if (!window.mindmapApi) return;
    
    const nodes = document.querySelectorAll('.react-flow__node');
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.getAttribute('data-id') === nodeId) {
        const nodeData = JSON.parse(node.getAttribute('data-field-data') || '{}');
        setImageUrl(nodeData.imageUrl || '');
        setCaption(nodeData.imageCaption || nodeData.label || '');
        setAltText(nodeData.imageAltText || '');
        setHasBorder(nodeData.imageBorder !== false);
        setAspectRatio(nodeData.imageAspectRatio || 'auto');
        setEffect(nodeData.imageEffect || 'none');
        break;
      }
    }
  }, [nodeId]);

  const handleSave = () => {
    if (!window.mindmapApi) return;
    
    window.mindmapApi.updateNodeData(nodeId, {
      label: caption,
      imageUrl,
      imageCaption: caption,
      imageAltText: altText,
      imageBorder: hasBorder,
      imageAspectRatio: aspectRatio,
      imageEffect: effect,
    });
    
    toast({
      title: "Changes saved",
      description: "Image node has been updated",
      duration: 2000,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input 
          id="imageUrl" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
          placeholder="Enter image URL"
        />
      </div>
      
      {/* Image preview */}
      <div className="border rounded-md overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={altText || caption} 
            className={`w-full h-40 object-contain bg-gray-100 
              ${effect === 'grayscale' ? 'grayscale' : ''} 
              ${effect === 'sepia' ? 'sepia' : ''} 
              ${effect === 'blur' ? 'blur-sm' : ''}`}
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center text-gray-400">
              <ImageIcon className="h-10 w-10 mb-2" />
              <span className="text-xs">No image preview</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="caption">Caption</Label>
        <Input 
          id="caption" 
          value={caption} 
          onChange={(e) => setCaption(e.target.value)} 
          placeholder="Enter image caption"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="altText">Alt Text (for accessibility)</Label>
        <Input 
          id="altText" 
          value={altText} 
          onChange={(e) => setAltText(e.target.value)} 
          placeholder="Describe the image"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="border" 
          checked={hasBorder} 
          onCheckedChange={setHasBorder}
        />
        <Label htmlFor="border">Show border</Label>
      </div>
      
      <div className="space-y-2">
        <Label>Aspect Ratio</Label>
        <RadioGroup value={aspectRatio} onValueChange={(value) => setAspectRatio(value as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auto" id="auto" />
            <Label htmlFor="auto">Auto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="square" id="square" />
            <Label htmlFor="square">Square (1:1)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wide" id="wide" />
            <Label htmlFor="wide">Wide (16:9)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="tall" id="tall" />
            <Label htmlFor="tall">Tall (9:16)</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Visual Effect</Label>
        <RadioGroup value={effect} onValueChange={(value) => setEffect(value as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="grayscale" id="grayscale" />
            <Label htmlFor="grayscale">Grayscale</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sepia" id="sepia" />
            <Label htmlFor="sepia">Sepia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blur" id="blur" />
            <Label htmlFor="blur">Blur</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button className="w-full" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
};
