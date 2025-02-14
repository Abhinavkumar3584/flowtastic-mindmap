
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { BaseNodeData } from "./types";

interface SectionSettingsProps {
  data: BaseNodeData;
  nodeId: string;
}

export function SectionSettings({ data, nodeId }: SectionSettingsProps) {
  const handleChange = (updates: Partial<BaseNodeData>) => {
    window.mindmapApi?.updateNodeData(nodeId, updates);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute top-0 right-0 -translate-y-full">
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Section Settings</h3>
            <p className="text-sm text-muted-foreground">
              Customize the appearance of your section
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={data.label}
                onChange={(e) => handleChange({ label: e.target.value })}
                placeholder="Enter section label"
              />
            </div>

            <div className="space-y-2">
              <Label>Border Color</Label>
              <div className="grid grid-cols-6 gap-2">
                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-md border ${
                      data.strokeColor === color ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleChange({ strokeColor: color })}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Border Width</Label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[data.strokeWidth || 2]}
                onValueChange={([value]) => handleChange({ strokeWidth: value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Slider
                min={0}
                max={20}
                step={1}
                value={[data.borderRadius || 0]}
                onValueChange={([value]) => handleChange({ borderRadius: value })}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
