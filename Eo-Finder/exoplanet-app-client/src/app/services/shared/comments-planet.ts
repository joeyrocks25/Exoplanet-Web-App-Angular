// SharedPlanetService
// This service provides functionality for sharing selected deck and planet IDs among components.
// It utilises BehaviorSubjects to create observables for selected deck and planet IDs.

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedPlanetService {
  private selectedDeckIdSource = new BehaviorSubject<string>('');
  selectedDeckId$ = this.selectedDeckIdSource.asObservable();

  private selectedPlanetIdSource = new BehaviorSubject<string>('');
  selectedPlanetId$ = this.selectedPlanetIdSource.asObservable();

  setSelectedDeckAndPlanetId(deckId: string, planetId: string): void {
    this.selectedDeckIdSource.next(deckId);
    this.selectedPlanetIdSource.next(planetId);
  }

  clearSelectedPlanetId(): void {
    this.selectedPlanetIdSource.next('');
  }
}
