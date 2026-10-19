import JSZip from 'jszip';
import { Photo } from '@/types';

/**
 * Downloads a single photo directly via anchor blob or direct URL
 */
export async function downloadSinglePhoto(photo: Photo, filename?: string): Promise<void> {
  const name = filename || `${photo.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${photo.id}.jpg`;
  try {
    const response = await fetch(photo.url, { mode: 'cors' });
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback: direct window open or anchor
    const link = document.createElement('a');
    link.href = photo.url;
    link.target = '_blank';
    link.download = name;
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Bundles multiple photos into a ZIP archive with progress callback
 */
export async function downloadPhotosAsZip(
  photos: Photo[],
  zipFilename: string,
  onProgress?: (percent: number, statusText: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(zipFilename.replace(/\.zip$/i, '')) || zip;

  let completed = 0;
  const total = photos.length;

  if (total === 0) return;

  onProgress?.(5, `Preparing archive for ${total} photos...`);

  // Process photos concurrently in chunks of 4 to avoid overwhelming the browser
  const chunkSize = 4;
  for (let i = 0; i < photos.length; i += chunkSize) {
    const chunk = photos.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (photo, index) => {
        const itemIdx = i + index + 1;
        const cleanTitle = photo.title.replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${String(itemIdx).padStart(3, '0')}_${cleanTitle}.jpg`;

        try {
          const res = await fetch(photo.url, { mode: 'cors' });
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const blob = await res.blob();
          folder.file(filename, blob);
        } catch {
          // If CORS prevents fetch, we embed a descriptive placeholder or fetch thumbnail
          try {
            const thumbRes = await fetch(photo.thumbnailUrl, { mode: 'cors' });
            const thumbBlob = await thumbRes.blob();
            folder.file(filename, thumbBlob);
          } catch {
            // Write link reference text file if completely blocked by browser CORS
            folder.file(
              `${filename}.txt`,
              `Photo: ${photo.title}\nDirect Download URL: ${photo.url}\nResolution: ${photo.width}x${photo.height}`
            );
          }
        }
        completed++;
        const percent = Math.min(90, Math.round((completed / total) * 85) + 5);
        onProgress?.(percent, `Fetched ${completed} of ${total} photos...`);
      })
    );
  }

  onProgress?.(92, 'Compressing ZIP archive...');
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  onProgress?.(100, 'Download starting...');
  const blobUrl = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = zipFilename.endsWith('.zip') ? zipFilename : `${zipFilename}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
