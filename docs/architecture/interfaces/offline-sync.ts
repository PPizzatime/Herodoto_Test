/**
 * Offline Caching & Synchronization Logic
 * Defines how mobile apps manage offline guides and audio files.
 */

export interface OfflineManager {
  /** Download all assets (images, audio, JSON) for a specific guide */
  downloadGuideForOffline(guideId: string): Promise<DownloadStatus>;
  
  /** Check if a guide is available offline */
  isGuideAvailableOffline(guideId: string): Promise<boolean>;
  
  /** Remove a downloaded guide to free up space */
  removeOfflineGuide(guideId: string): Promise<void>;
  
  /** Synchronize local progress (e.g. points earned offline) with the server */
  syncOfflineProgress(): Promise<void>;
}

export interface DownloadStatus {
  progress: number; // 0 to 100
  totalBytes: number;
  downloadedBytes: number;
}
