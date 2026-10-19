/**
 * Cloudflare R2 Direct Upload Service
 * Demonstrates direct browser-to-object-storage uploads using signed URLs.
 * Large binaries never traverse the web application server.
 */

export interface PresignedUrlResponse {
  uploadUrl: string;
  storageKey: string;
  publicCdnUrl: string;
  thumbnailUrl: string;
}

export const storageService = {
  /**
   * Step 1: Request a signed upload URL from the Cloudflare Worker API.
   * In a live deployment, this calls: POST /api/upload/presign
   */
  async getPresignedUploadUrl(filename: string, fileType: string, eventId: string): Promise<PresignedUrlResponse> {
    const timestamp = Date.now();
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `events/${eventId}/${timestamp}-${cleanFilename}`;
    
    // In production: const res = await fetch('/api/upload/presign', { method: 'POST', body: JSON.stringify({ key, fileType }) });
    return {
      uploadUrl: `https://r2.lumina-studios.workers.dev/${storageKey}?signature=mock_sig_${timestamp}`,
      storageKey,
      publicCdnUrl: `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=2000&auto=format&fit=crop&q=90`,
      thumbnailUrl: `https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=75`,
    };
  },

  /**
   * Step 2: Upload directly to Cloudflare R2 using the presigned URL with progress monitoring
   */
  async uploadDirectToR2(
    file: File,
    uploadUrl: string,
    onProgress: (percent: number) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      // Simulate real chunked network streaming to Cloudflare R2
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 25) + 15;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          onProgress(100);
          resolve();
        } else {
          onProgress(currentProgress);
        }
      }, 120);
    });
  },
};
