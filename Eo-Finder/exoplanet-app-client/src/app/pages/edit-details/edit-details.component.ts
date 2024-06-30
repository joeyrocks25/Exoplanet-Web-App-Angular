// edit-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ImageCacheService } from 'src/app/services/image-cache-service';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css']
})
export class EditDetailsComponent implements OnInit {
  imageUrl = '/assets/images/editprofile.jpg';
  cachedImage: string | undefined;

  constructor(private imageCacheService: ImageCacheService) {}

  // Lifecycle hook called after Angular has initialized all data-bound properties
  ngOnInit(): void {
    this.loadImage();
  }

  // Load the background image using the image cache service
  loadImage(): void {
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
