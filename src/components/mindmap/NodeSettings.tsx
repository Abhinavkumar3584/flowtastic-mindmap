import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { BaseNodeData } from "./types";

const strokeColors = ['black', 'red', 'green', 'blue', 'orange', 'black'];
const backgroundColors = ['white', 'pink', 'lightgreen', 'lightblue', 'lightyellow', 'transparent'];
const fontFamilies = ['serif', 'sans-serif', 'monospace', 'cursive'];
const fontSizes = ['S', 'M', 'L', 'XL'] as const;
const strokeStyles = ['solid', 'dashed', 'dotted'] as const;
const textAligns = ['left', 'center', 'right'] as const;

interface NodeSettingsProps {
  data: BaseNodeData;
  onChange: (updates: Partial<BaseNodeData>) => void;
}

export function NodeSettings({ data, onChange }: NodeSettingsProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute top-0 right-0 -translate-y-full">
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="space-y-6">
          <div>
            <h4 className="mb-2 font-medium">Stroke Color</h4>
            <div className="flex gap-2">
              {strokeColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border ${
                    data.strokeColor === color ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onChange({ strokeColor: color })}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Background Color</h4>
            <div className="flex gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border ${
                    data.backgroundColor === color ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onChange({ backgroundColor: color })}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Stroke Width</h4>
            <Slider
              value={[data.strokeWidth || 1]}
              min={1}
              max={5}
              step={1}
              onValueChange={([value]) => onChange({ strokeWidth: value })}
            />
          </div>

          <div>
            <h4 className="mb-2 font-medium">Stroke Style</h4>
            <div className="flex gap-2">
              {strokeStyles.map((style) => (
                <Button
                  key={style}
                  variant={data.strokeStyle === style ? "default" : "outline"}
                  onClick={() => onChange({ strokeStyle: style })}
                >
                  {style === 'solid' ? '—' : style === 'dashed' ? '- -' : '...'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Font Family</h4>
            <div className="flex gap-2 flex-wrap">
              {fontFamilies.map((font) => (
                <Button
                  key={font}
                  variant={data.fontFamily === font ? "default" : "outline"}
                  onClick={() => onChange({ fontFamily: font })}
                  style={{ fontFamily: font }}
                >
                  Aa
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Font Size</h4>
            <div className="flex gap-2">
              {fontSizes.map((size) => (
                <Button
                  key={size}
                  variant={data.fontSize === size ? "default" : "outline"}
                  onClick={() => onChange({ fontSize: size })}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Text Align</h4>
            <div className="flex gap-2">
              {textAligns.map((align) => (
                <Button
                  key={align}
                  variant={data.textAlign === align ? "default" : "outline"}
                  onClick={() => onChange({ textAlign: align })}
                >
                  {align === 'left' ? '⇤' : align === 'center' ? '⇔' : '⇥'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Opacity</h4>
            <Slider
              value={[data.opacity || 1]}
              min={0.1}
              max={1}
              step={0.1}
              onValueChange={([value]) => onChange({ opacity: value })}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}