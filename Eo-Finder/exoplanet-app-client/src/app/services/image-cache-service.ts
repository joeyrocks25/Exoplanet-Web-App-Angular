import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageCacheService {
  private cache: Map<string, string> = new Map();

  // Check if the image is in the cache
  getImage(url: string): string | undefined {
    return this.cache.get(url);
  }

  // Load and cache the image
  loadImage(url: string): Promise<string> {
    return new Promise<string>((resolve) => {
      const cachedImage = this.getImage(url);
      if (cachedImage) {
        resolve(cachedImage);
      } else {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (context) {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            const base64Image = canvas.toDataURL('image/jpeg');
            this.cacheImage(url, base64Image);
            resolve(base64Image);
          }
        };
        image.src = url;
      }
    });
  }

  // Add the base64 representation of the image to the cache
  private cacheImage(url: string, base64Image: string): void {
    this.cache.set(url, base64Image);
  }
}
