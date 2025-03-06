
import { saveMindMap } from './mindmapStorage';
import { MindMapData } from '@/components/mindmap/types';

interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // in milliseconds
  mindMapData: MindMapData | null;
}

class AutoSaveManager {
  private config: AutoSaveConfig;
  private timerId: NodeJS.Timeout | null = null;

  constructor() {
    this.config = {
      enabled: false,
      interval: 60000, // Default: 1 minute
      mindMapData: null
    };
  }

  public start(mindMapData: MindMapData): void {
    if (!this.config.enabled || !mindMapData.name) return;
    
    this.stop(); // Clear any existing timer
    this.config.mindMapData = mindMapData;
    
    this.timerId = setInterval(() => {
      if (this.config.mindMapData && this.config.mindMapData.name) {
        console.log(`Auto-saving mind map: ${this.config.mindMapData.name}`);
        saveMindMap(this.config.mindMapData);
      }
    }, this.config.interval);
    
    console.log(`Auto-save started with interval: ${this.config.interval / 1000}s`);
  }

  public stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      console.log('Auto-save stopped');
    }
  }

  public updateConfig(config: Partial<AutoSaveConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart if enabled and we have data
    if (this.config.enabled && this.config.mindMapData) {
      this.start(this.config.mindMapData);
    } else {
      this.stop();
    }
  }

  public updateMindMapData(mindMapData: MindMapData): void {
    this.config.mindMapData = mindMapData;
    
    if (this.config.enabled && mindMapData.name) {
      this.start(mindMapData);
    }
  }

  public getConfig(): AutoSaveConfig {
    return { ...this.config };
  }
}

export const autoSaveManager = new AutoSaveManager();
