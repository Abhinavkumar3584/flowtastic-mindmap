
import { MindMapData } from '@/components/mindmap/types';

interface HistoryState {
  nodes: any[];
  edges: any[];
}

class HistoryManager {
  private past: HistoryState[] = [];
  private future: HistoryState[] = [];
  private maxHistory: number = 30;
  private lastSavedState: HistoryState | null = null;
  private ignoreNextChange: boolean = false;

  constructor() {
    this.past = [];
    this.future = [];
  }

  public saveState(nodes: any[], edges: any[]): void {
    if (this.ignoreNextChange) {
      this.ignoreNextChange = false;
      return;
    }

    // Create a deep copy to avoid reference issues
    const newState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };

    this.past.push(newState);
    
    // Limit history size
    if (this.past.length > this.maxHistory) {
      this.past.shift();
    }
    
    // Clear future when new action is taken
    this.future = [];
  }

  public undo(setNodes: React.Dispatch<React.SetStateAction<any[]>>, setEdges: React.Dispatch<React.SetStateAction<any[]>>): boolean {
    if (this.past.length <= 1) {
      return false; // Can't undo if there's nothing in the past or only current state
    }

    // Move current state to future
    const currentState = this.past.pop();
    if (currentState) {
      this.future.push(currentState);
    }

    // Get previous state
    const previousState = this.past[this.past.length - 1];
    if (previousState) {
      this.ignoreNextChange = true; // Don't record this change as a new history entry
      setNodes([...previousState.nodes]);
      setEdges([...previousState.edges]);
      return true;
    }

    return false;
  }

  public redo(setNodes: React.Dispatch<React.SetStateAction<any[]>>, setEdges: React.Dispatch<React.SetStateAction<any[]>>): boolean {
    if (this.future.length === 0) {
      return false; // Can't redo if there's nothing in the future
    }

    // Get next state
    const nextState = this.future.pop();
    if (nextState) {
      // Add current state to past
      this.past.push(nextState);
      
      this.ignoreNextChange = true; // Don't record this change as a new history entry
      setNodes([...nextState.nodes]);
      setEdges([...nextState.edges]);
      return true;
    }

    return false;
  }

  public clear(): void {
    this.past = [];
    this.future = [];
  }

  public setLastSavedState(nodes: any[], edges: any[]): void {
    this.lastSavedState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };
  }

  public hasUnsavedChanges(nodes: any[], edges: any[]): boolean {
    if (!this.lastSavedState) return true;
    
    return JSON.stringify(this.lastSavedState.nodes) !== JSON.stringify(nodes) || 
           JSON.stringify(this.lastSavedState.edges) !== JSON.stringify(edges);
  }
}

export const historyManager = new HistoryManager();
