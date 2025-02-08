
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { EdgeData } from "./types";

interface EdgeStylePanelProps {
  isOpen: boolean;
  onClose: () => void;
  edgeStyle: EdgeData;
  onStyleChange: (style: Partial<EdgeData>) => void;
}

export const EdgeStylePanel = ({ isOpen, onClose, edgeStyle, onStyleChange }: EdgeStylePanelProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edge Style</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <input 
              type="color" 
              value={edgeStyle.color || '#000000'} 
              onChange={(e) => onStyleChange({ color: e.target.value })}
              className="w-full h-10 cursor-pointer rounded-md"
            />
          </div>

          {/* Stroke Style */}
          <div className="space-y-2">
            <Label>Stroke Style</Label>
            <RadioGroup
              value={edgeStyle.strokeStyle || 'solid'}
              onValueChange={(value) => onStyleChange({ strokeStyle: value as EdgeData['strokeStyle'] })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solid" id="solid" />
                <Label htmlFor="solid">Solid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dashed" id="dashed" />
                <Label htmlFor="dashed">Dashed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dotted" id="dotted" />
                <Label htmlFor="dotted">Dotted</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Path Style */}
          <div className="space-y-2">
            <Label>Path Style</Label>
            <RadioGroup
              value={edgeStyle.pathStyle || 'bezier'}
              onValueChange={(value) => onStyleChange({ pathStyle: value as EdgeData['pathStyle'] })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="straight" id="straight" />
                <Label htmlFor="straight">Straight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="smoothstep" id="smoothstep" />
                <Label htmlFor="smoothstep">Smooth</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bezier" id="bezier" />
                <Label htmlFor="bezier">Bezier</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Arrows */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Start Arrow</Label>
              <Switch
                checked={edgeStyle.arrowStart}
                onCheckedChange={(checked) => onStyleChange({ arrowStart: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>End Arrow</Label>
              <Switch
                checked={edgeStyle.arrowEnd}
                onCheckedChange={(checked) => onStyleChange({ arrowEnd: checked })}
              />
            </div>
          </div>

          {/* Stroke Width */}
          <div className="space-y-2">
            <Label>Stroke Width</Label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[edgeStyle.strokeWidth || 1]}
              onValueChange={([value]) => onStyleChange({ strokeWidth: value })}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
