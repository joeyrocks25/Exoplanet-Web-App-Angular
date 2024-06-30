import { Component, OnInit } from '@angular/core';
import { ImageCacheService } from 'src/app/services/image-cache-service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  imageUrl = '/assets/images/landing-page-bg.jpg';
  cachedImage: string | undefined;

  constructor(private imageCacheService: ImageCacheService) {}

  // Lifecycle hook called after Angular has initialized all data-bound properties
  ngOnInit(): void {
    // Load the background image using the image cache service
    this.imageCacheService.loadImage(this.imageUrl).then((base64Image) => {
      this.cachedImage = base64Image;
    });
  }

  // Get the background image style to apply in the template
  getBackgroundImageStyle(): { [key: string]: string } {
    return {
      'background-image': this.cachedImage ? `url('${this.cachedImage}')` : `url('${this.imageUrl}')`,
      'background-size': 'cover',
      'background-position': 'center',
      'background-repeat': 'no-repeat',
    };
  }
}
