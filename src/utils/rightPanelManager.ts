
import { create } from 'zustand';

interface RightPanelState {
  isOpen: boolean;
  activeNodeId: string | null;
  activeNodeType: string | null;
  openPanel: (nodeId: string, nodeType: string) => void;
  closePanel: () => void;
}

export const useRightPanel = create<RightPanelState>((set) => ({
  isOpen: false,
  activeNodeId: null,
  activeNodeType: null,
  openPanel: (nodeId, nodeType) => set({ isOpen: true, activeNodeId: nodeId, activeNodeType: nodeType }),
  closePanel: () => set({ isOpen: false, activeNodeId: null, activeNodeType: null }),
}));
