// This service provides a mechanism for components to communicate and trigger a refresh
// when a planet is deleted, allows other components to update their state accordingly.

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshService {
  private planetDeletedSubject = new Subject<string>();

  planetDeleted$ = this.planetDeletedSubject.asObservable();

  // Method to notify subscribers that a planet has been deleted
  planetDeleted(planetId: string) {
    this.planetDeletedSubject.next(planetId);
  }
}
