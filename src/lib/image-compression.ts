/**
 * High-performance client-side image compressor using HTML5 Canvas.
 * Solves:
 * 1. Mobile phone cameras taking 6MB - 18MB high-res photos
 * 2. LocalStorage 5MB quota errors
 * 3. Supabase payload / timeout limits
 * 4. Automatic orientation & aspect-ratio preservation
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<string> {
  const { maxWidth = 600, maxHeight = 600, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    // If it's a PDF, we don't compress via canvas
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => {
        // Fallback to raw data url if canvas cannot decode (e.g. svg)
        resolve(readerEvent.target?.result as string);
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with optimal compression
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
