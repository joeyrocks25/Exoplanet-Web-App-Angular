import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DeckService } from 'src/app/services/deck.services';
import { DeckSelectionService } from 'src/app/services/shared/planet-deck';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateCollectionDialogComponent } from 'src/app/dialogs/create-collection-dialog/create-collection-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';  

@Component({
  selector: 'app-exoplanet-hud',
  templateUrl: './exoplanet-hud.component.html',
  styleUrls: ['./exoplanet-hud.component.css']
})
export class ExoplanetHUDComponent implements OnInit {
  @Output() deckCreated = new EventEmitter<string>();
  decks: any[] = [];
  pagedDecks: any[] = [];
  currentPage = 1;
  decksPerPage = 7;
  totalDecks = 0;
  selectedDeck: any;
  newDeckName: string = '';
  deckFilter: string = '';

  constructor(
    private deckService: DeckService,
    private deckSelectionService: DeckSelectionService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  // Initialize the component by loading decks
  ngOnInit(): void {
    this.currentPage= 1;
    this.loadDecks();
  }

  // Log button click and perform associated actions (delete or view)
  logButtonClick(action: string, deckId: string): void {
    console.log(`Button clicked for deck with ID ${deckId}. Action: ${action}`);

    if (action === 'delete') {
      this.deleteDeck(deckId);
    } else if (action === 'view') {
      this.viewDeck(deckId);
    }
  }

  // Delete the deck with the specified ID
  deleteDeck(deckId: string): void {
    console.log(`Deleting deck with ID: ${deckId}`);
    this.deckService.deleteDeck(deckId).subscribe(
      () => {
        console.log(`Collection with ID ${deckId} deleted successfully.`);
        this.openSnackBar("Collection successfully removed",'success');
        this.loadDecks();
      },
      (error) => {
        console.error(`Error deleting deck with ID ${deckId}:`, error);
      }
    );
  }

  // Load the decks and update the displayed decks based on the current page
  private loadDecks(): void {
    this.deckService.getDecks(this.currentPage, this.decksPerPage).subscribe(
      (response: any) => {
        this.decks = response.decks;
        this.totalDecks = this.decks.length;
        const totalPages = this.calculateTotalPages();
        this.currentPage = Math.max(1, Math.min(this.currentPage, totalPages));
        this.pagedDecks = this.decks
          .filter(deck => !this.deckFilter || deck.name.toLowerCase().includes(this.deckFilter.toLowerCase()))
          .slice((this.currentPage - 1) * this.decksPerPage, this.currentPage * this.decksPerPage);
        this.totalDecks = this.decks.length;
      },
      (error) => {
        console.error('Error loading collection:', error);
      }
    );
  }

  // Navigate to the next page of decks
  onNextPage(): void {
    const totalPages = this.calculateTotalPages();
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.loadDecks();
    }
  }

  // Navigate to the previous page of decks
  onPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDecks();
    }
  }

  // Calculate the total number of pages based on the total number of decks and decks per page
  calculateTotalPages(): number {
    return Math.ceil(this.totalDecks / this.decksPerPage);
  }

  // Filter the decks based on the search filter
  private filterDecks(): void {
    this.pagedDecks = this.decks
      .filter(deck => !this.deckFilter || deck.name.toLowerCase().includes(this.deckFilter.toLowerCase()))
      .slice((this.currentPage - 1) * this.decksPerPage, this.currentPage * this.decksPerPage);
  }

  // View the deck with the specified ID
  viewDeck(deckId: string): void {
    this.router.navigate(['/revision-notes', deckId]);
  }

  // Select a deck and update the selected deck in the service
  selectDeck(deck: any): void {
    this.selectedDeck = deck;
    this.deckSelectionService.setSelectedDeckId(deck.id);
  }

  // Apply the current filter and load the decks
  applyFilter(): void {
    this.currentPage = 1;
    this.loadDecks();
  }

  // Filter decks on-the-fly based on the search box input
  filterOnTheFly(): void {
    this.filterDecks();
  }


  // Handle the click event on the "Plus" icon and open the create deck dialog
  // we've created collection dialog to create new deck
  onPlusIconClick(): void {
    const dialogRef = this.dialog.open(CreateCollectionDialogComponent, {
      width: '270px',
      height: '180px',
      data: { collectionName: this.newDeckName } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDecks();
      }
    });
  }

  // Open a snackbar with the given message and styling
  openSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
