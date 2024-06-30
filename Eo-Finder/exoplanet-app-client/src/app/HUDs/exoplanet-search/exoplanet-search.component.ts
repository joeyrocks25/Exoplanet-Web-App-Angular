import { Component, EventEmitter, Output } from '@angular/core';
import { ExoplanetService } from 'src/app/services/exoplanet.service';
import { DeckSelectionService } from 'src/app/services/shared/planet-deck';
import { PlanetService } from 'src/app/services/planet.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-exoplanet-search',
  templateUrl: './exoplanet-search.component.html',
  styleUrls: ['./exoplanet-search.component.css']
})
export class ExoplanetSearchComponent {
  @Output() exoplanetSearchResults = new EventEmitter<any>();
  searchValue: string = '';
  exoplanets: any[] = [];
  pagedExoplanets: any[] = [];
  currentPage = 1;
  itemsPerPage = 7;
  totalExoplanets = 0;
  detailedView = false;
  selectedExoplanet: any;
  selectedDeckId: string | null = null;
  private deckSubscription: Subscription;
  feedbackMessage: string = '';

  constructor(
    private exoplanetService: ExoplanetService,
    private deckSelectionService: DeckSelectionService,
    private planetService: PlanetService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Subscribe to deck changes
    this.deckSubscription = this.deckSelectionService.selectedDeckId$.subscribe((deckId) => {
      this.selectedDeckId = deckId;
    });
  }

  ngOnDestroy() {
    // Unsubscribe from deck changes
    this.deckSubscription.unsubscribe();
  }

  // Search for exoplanets based on the entered search term
  // also assists pagination
  searchExoplanets(): void {
    if (this.searchValue) {
      this.exoplanetService.searchExoplanets(this.searchValue).subscribe((response: any) => {
        this.exoplanets = response.exoplanets;
        this.totalExoplanets = this.exoplanets.length;
        this.currentPage = 1;
        this.updatePagedExoplanets();

        if (this.totalExoplanets === 0) {
          this.openSnackBar('No exoplanets found for the given search term.', 'warning');
        } else {
          this.exoplanetSearchResults.emit(this.pagedExoplanets);
          this.openSnackBar('Exoplanets found successfully.', 'success');
        }
      });
    } else {
      this.openSnackBar('Please enter a search term.', 'error');
    }
  }

  // Update the paged exoplanets based on the current page
  private updatePagedExoplanets(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedExoplanets = this.exoplanets.slice(startIndex, endIndex);
  }

  // Navigate to the next page of exoplanets
  onNextPage(): void {
    if (this.currentPage < this.calculateTotalPages()) {
      this.currentPage++;
      this.updatePagedExoplanets();
      this.exoplanetSearchResults.emit(this.pagedExoplanets);
    }
  }

  // Navigate to the previous page of exoplanets
  onPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedExoplanets();
      this.exoplanetSearchResults.emit(this.pagedExoplanets);
    }
  }

  // Calculate the total number of pages based on the total number of exoplanets and items per page
  calculateTotalPages(): number {
    return Math.ceil(this.totalExoplanets / this.itemsPerPage);
  }

  // View more details of a specific exoplanet
  viewMore(exoplanet: any): void {
    this.detailedView = true;
    this.selectedExoplanet = exoplanet;
  }

  // Add the selected exoplanet to the selected deck
  addToDeck(exoplanet: any): void {
    if (this.selectedDeckId) {
      console.log(`Adding exoplanet ${exoplanet.planet_name} to deck ID: ${this.selectedDeckId}`);
      this.planetService.addPlanetToDeck(this.selectedDeckId, exoplanet).subscribe(
        (response: any) => {
          console.log(`Exoplanet ${exoplanet.planet_name} added to deck successfully. Deck ID: ${this.selectedDeckId}`);
          this.openSnackBar(`Exoplanet ${exoplanet.planet_name} added to deck successfully.`, 'success');
        },
        (error) => {
          console.error('Error adding exoplanet to deck:', error);
          this.openSnackBar('Error adding exoplanet to deck. Please try again.', 'error');
        }
      );
    } else {
      console.error('No selected deck. Please choose a deck before adding an exoplanet.');
      this.openSnackBar('No selected deck. Please choose a deck before adding an exoplanet.', 'error');
    }
  }

  // Close the detailed view of an exoplanet
  closeDetailView(): void {
    this.detailedView = false;
    this.selectedExoplanet = null;
  }

  // View the deck associated with the selected deck ID
  onViewDeck(): void {
    if (this.selectedDeckId) {
      this.router.navigate(['/revision-notes', this.selectedDeckId]);
    }
  }

  // Open a snackbar with the given message and styling
  openSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
