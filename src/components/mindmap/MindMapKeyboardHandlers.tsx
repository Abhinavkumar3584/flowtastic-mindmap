
import { useEffect } from 'react';

interface UseMindMapKeyboardHandlersProps {
  selectedNode: string | null;
  deleteNode: (id: string) => void;
  undo: () => void;
  redo: () => void;
  save: () => void;
}

export const useMindMapKeyboardHandlers = ({
  selectedNode,
  deleteNode,
  undo,
  redo,
  save
}: UseMindMapKeyboardHandlersProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore key presses when typing in input fields
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Delete the selected node when 'Delete' key is pressed
      if (event.key === 'Delete' && selectedNode) {
        deleteNode(selectedNode);
      }
      
      // Undo - Ctrl+Z
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      }
      
      // Redo - Ctrl+Y or Ctrl+Shift+Z
      if ((event.ctrlKey || event.metaKey) && 
          ((event.key === 'y') || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault();
        redo();
      }
      
      // Save - Ctrl+S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        save();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, deleteNode, undo, redo, save]);
};
