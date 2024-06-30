// DeckSelectionService
// This service provides functionality for managing the selected deck ID and sharing between components.
// It utilises a BehaviorSubject to create an observable for the selected deck ID.
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeckSelectionService {
  private selectedDeckIdSubject = new BehaviorSubject<string | null>(null);
  selectedDeckId$ = this.selectedDeckIdSubject.asObservable();

  // This method is called to update the selected deck ID and notify the subscribers.
  setSelectedDeckId(deckId: string): void {
    this.selectedDeckIdSubject.next(deckId);
  }
}
