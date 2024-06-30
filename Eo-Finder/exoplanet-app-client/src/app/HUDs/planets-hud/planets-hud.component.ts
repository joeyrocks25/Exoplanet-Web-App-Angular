import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanetService } from 'src/app/services/planet.service';
import { SharedPlanetService } from 'src/app/services/shared/comments-planet';
import { MatSnackBar } from '@angular/material/snack-bar';  // Added import for MatSnackBar

@Component({
  selector: 'app-planets-hud',
  templateUrl: './planets-hud.component.html',
  styleUrls: ['./planets-hud.component.css']
})
export class PlanetsHudComponent implements OnInit {
  @Input() planets: any[] = [];
  selectedPlanet: any;
  deckId: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private planetService: PlanetService,
    private route: ActivatedRoute,
    private sharedPlanetService: SharedPlanetService,
    private snackBar: MatSnackBar  // Added MatSnackBar to the constructor
  ) {}
  
  // Get deck id from shared service
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.deckId = params['deckId'] || '';
    });
  }

  // Toggles the display of details for a specific planet.
  toggleDetails(planet: any) {
    planet.showDetails = !planet.showDetails;
  }

  // Toggles the display of the comment box for a specific planet.
  toggleCommentBox(planet: any) {
    planet.showCommentBox = !planet.showCommentBox;
  }

  // Saves a comment for a specific planet and hides the comment box.
  saveComment(planet: any, commentText: string) {
    planet.comment = commentText;
    this.toggleCommentBox(planet);
  }

  // Logs the deletion of a planet and calls the deletePlanet method.
  logDelete(planet: any) {
    console.log(`Deleting planet: ${planet.planet_name}`);
    this.deletePlanet(planet.id);
  }

  // Selects a planet and updates the sharedPlanetService with the selected deck and planet IDs.
  selectPlanet(planet: any) {
    this.selectedPlanet = planet;
    this.cdr.detectChanges();

    this.sharedPlanetService.setSelectedDeckAndPlanetId(this.deckId, planet.id);
  }

  // Deletes a planet with the specified planetId from the current deck.
  private deletePlanet(planetId: string): void {
    this.planetService.deletePlanet(this.deckId, planetId).subscribe(
      () => {
        console.log(`Planet with ID ${planetId} deleted successfully from deck with ID ${this.deckId}.`);
        this.planets = this.planets.filter(p => p.id !== planetId);
        this.showSnackbar('Planet removed successfully', 'success');
      },
      (error) => {
        console.error(`Error deleting planet with ID ${planetId} from deck with ID ${this.deckId}:`, error);
      }
    );
  }

  // Function to show a snackbar with the given message and styling
  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
