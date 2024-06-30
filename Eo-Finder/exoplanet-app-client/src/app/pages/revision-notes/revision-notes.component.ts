import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanetService } from 'src/app/services/planet.service';

@Component({
  selector: 'app-revision-notes',
  templateUrl: './revision-notes.component.html',
  styleUrls: ['./revision-notes.component.css']
})
export class RevisionNotesComponent implements OnInit {
  deckId: string = '';
  planets: any[] = [];

  constructor(private route: ActivatedRoute, private PlanetService: PlanetService) {}

  ngOnInit(): void {
    // Subscribe to route parameters to get the deckId from the URL.
    this.route.params.subscribe((params) => {
      console.log('Params Object:', params);
      this.deckId = params['deckId'] || '';
      console.log('Deck ID in Revision Notes Component:', this.deckId);

      // Fetch planets for the specified deck.
      this.getPlanetsForDeck();
    });
  }

  // Private method to fetch planets for the current deck.
  private getPlanetsForDeck() {
    this.PlanetService.getPlanetsForDeck(this.deckId).subscribe(
      (response: any) => {
        this.planets = response.planets;
        console.log('Planets for deck:', this.planets);
      },
      (error) => {
        console.error('Error fetching planets:', error);
      }
    );
  }
}
