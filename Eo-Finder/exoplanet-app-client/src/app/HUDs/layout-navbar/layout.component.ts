// layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isHomePage: boolean = false;
  isEditPage: boolean = false;
  isRevisionPage: boolean = false;
  deckId: string | null = null;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.router.url === '/home';
        this.isEditPage = this.router.url === '/edit-profile';
        this.isRevisionPage = this.router.url.startsWith('/revision-notes/');
        this.deckId = this.extractDeckId();
      }
    });
  }

  private extractDeckId(): string | null {
    const match = this.router.url.match(/^\/revision-notes\/([^\/]+)/);
    return match ? match[1] : null;
  }

  logout() {
    // Call the logout method from your authentication service
    this.authService.logout().subscribe(
      () => {
        // Logout successful logic, if needed
        console.log('Logout successful.');
        // Optionally, navigate to the login page or any other page after logout
        this.router.navigate(['/login']);
      },
      (error) => {
        // Logout failed logic, if needed
        console.error('Logout failed:', error);
      }
    );
  }
}
