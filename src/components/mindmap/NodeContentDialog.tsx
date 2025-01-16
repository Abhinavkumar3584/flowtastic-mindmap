import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BaseNodeData } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NodeContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: BaseNodeData;
}

export function NodeContentDialog({ open, onOpenChange, data }: NodeContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{data.label}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh]">
          {data.content && data.content.length > 0 && (
            <div className="space-y-4 mb-4">
              <h3 className="font-semibold">Content</h3>
              <div className="space-y-2">
                {data.content.map((item) => (
                  <div key={item.id} className="p-2 bg-secondary/20 rounded">
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.links && data.links.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Links</h3>
              <div className="space-y-2">
                {data.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-secondary/20 rounded hover:bg-secondary/30 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}