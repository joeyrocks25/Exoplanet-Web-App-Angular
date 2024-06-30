// home-page.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.services';
import { DeckService } from 'src/app/services/deck.services';
import { ImageCacheService } from 'src/app/services/image-cache-service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  username: string | undefined;
  exoplanets: any[] = [];
  cachedImage: string | undefined;
  imageUrl = '/assets/images/home-page-bg.jpg'; // Default image URL

  constructor(
    private authService: AuthService,
    private deckService: DeckService,
    private imageCacheService: ImageCacheService,
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.loadImage(this.imageUrl); // Load default image
  }

  loadUserDetails(): void {
    this.authService.getUserDetails().subscribe(userDetails => {
      this.username = userDetails?.username;
    });
  }

  createNewDeck(deckName: string): void {
    this.deckService.createDeck(deckName).subscribe(() => {
      this.loadUserDetails();
    });
  }

  updateExoplanets(exoplanets: any[]): void {
    this.exoplanets = exoplanets;
  }

  // Load and cache the image based on the provided URL
  loadImage(imageUrl: string): void {
    this.imageCacheService.loadImage(imageUrl).then((base64Image) => {
      this.cachedImage = base64Image;
    });
  }

  // Change the image URL and load the new image
  changeImage(newImageUrl: string): void {
    this.imageUrl = newImageUrl;
    this.loadImage(this.imageUrl);
  }

  getBackgroundImageStyle(): { [key: string]: string } {
    return {
      'background-image': this.cachedImage ? `url('${this.cachedImage}')` : 'none',
      'background-size': 'cover',
      'background-position': 'center',
      'background-repeat': 'no-repeat',
    };
  }
}
