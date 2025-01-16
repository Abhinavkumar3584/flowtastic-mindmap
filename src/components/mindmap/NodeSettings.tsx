import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BaseNodeData, FontSize } from "./types";

const strokeColors = ['black', 'red', 'green', 'blue', 'orange', 'black'];
const backgroundColors = ['white', 'pink', 'lightgreen', 'lightblue', 'lightyellow', 'transparent'];
const fontFamilies = ['serif', 'sans-serif', 'monospace', 'cursive'];
const strokeStyles = ['solid', 'dashed', 'dotted'] as const;
const textAligns = ['left', 'center', 'right'] as const;
const fontSizes: FontSize[] = ['xs', 's', 'm', 'l', 'xl'];

interface NodeSettingsProps {
  data: BaseNodeData;
  nodeId: string;
}

export function NodeSettings({ data, nodeId }: NodeSettingsProps) {
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
      <SheetContent>
        <div className="space-y-6">
          <div>
            <h4 className="mb-2 font-medium">Font Size</h4>
            <div className="flex gap-2">
              {fontSizes.map((size) => (
                <Button
                  key={size}
                  variant={data.fontSize === size ? "default" : "outline"}
                  onClick={() => handleChange({ fontSize: size })}
                  className="w-10"
                >
                  {size.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

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
                  onClick={() => handleChange({ strokeColor: color })}
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
                  onClick={() => handleChange({ backgroundColor: color })}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Stroke Style</h4>
            <div className="flex gap-2">
              {strokeStyles.map((style) => (
                <Button
                  key={style}
                  variant={data.strokeStyle === style ? "default" : "outline"}
                  onClick={() => handleChange({ strokeStyle: style })}
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
                  onClick={() => handleChange({ fontFamily: font })}
                  style={{ fontFamily: font }}
                >
                  Aa
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
                  onClick={() => handleChange({ textAlign: align })}
                >
                  {align === 'left' ? '⇤' : align === 'center' ? '⇔' : '⇥'}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Stroke Width</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((width) => (
                <Button
                  key={width}
                  variant={data.strokeWidth === width ? "default" : "outline"}
                  onClick={() => handleChange({ strokeWidth: width })}
                >
                  {width}px
                </Button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}