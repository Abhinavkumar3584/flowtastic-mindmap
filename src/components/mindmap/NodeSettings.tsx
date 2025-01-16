import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseNodeData, FontSize, ContentItem, LinkItem } from "./types";
import { useState } from "react";
import { X, Plus } from "lucide-react";

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
  const [newContent, setNewContent] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleChange = (updates: Partial<BaseNodeData>) => {
    window.mindmapApi?.updateNodeData(nodeId, updates);
  };

  const addContent = () => {
    if (!newContent.trim()) return;
    
    const newItem: ContentItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: newContent,
      type: 'text'
    };

    const updatedContent = [...(data.content || []), newItem];
    handleChange({ content: updatedContent });
    setNewContent('');
  };

  const removeContent = (id: string) => {
    const updatedContent = (data.content || []).filter(item => item.id !== id);
    handleChange({ content: updatedContent });
  };

  const addLink = () => {
    if (!newLinkUrl.trim() || !newLinkLabel.trim()) return;
    
    const newLink: LinkItem = {
      id: Math.random().toString(36).substr(2, 9),
      url: newLinkUrl,
      label: newLinkLabel
    };

    const updatedLinks = [...(data.links || []), newLink];
    handleChange({ links: updatedLinks });
    setNewLinkUrl('');
    setNewLinkLabel('');
  };

  const removeLink = (id: string) => {
    const updatedLinks = (data.links || []).filter(link => link.id !== id);
    handleChange({ links: updatedLinks });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute top-0 right-0 -translate-y-full">
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <Tabs defaultValue="style">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Add Content</Label>
                <div className="flex gap-2">
                  <Input
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Enter content text"
                  />
                  <Button onClick={addContent} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {data.content?.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-secondary/20 p-2 rounded">
                    <span className="flex-1">{item.text}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContent(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Add Link</Label>
                <div className="space-y-2">
                  <Input
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    placeholder="Link label"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="URL"
                    />
                    <Button onClick={addLink} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {data.links?.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 bg-secondary/20 p-2 rounded">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 hover:underline"
                    >
                      {link.label}
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(link.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
