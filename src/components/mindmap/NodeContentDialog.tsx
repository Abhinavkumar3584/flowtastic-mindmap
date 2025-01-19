import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NodeContent } from "./types";
import { ExternalLink } from "lucide-react";

interface NodeContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content?: NodeContent[];
  nodeLabel: string;
}

export const NodeContentDialog = ({ isOpen, onClose, content, nodeLabel }: NodeContentDialogProps) => {
  if (!content || content.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{nodeLabel}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {content.map((item, index) => (
            <div key={index} className="space-y-2">
              {item.title && (
                <h3 className="text-sm font-medium">{item.title}</h3>
              )}
              {item.type === 'link' ? (
                <a
                  href={item.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <ExternalLink size={16} />
                  {item.value}
                </a>
              ) : (
                <p className="text-sm text-gray-600">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};