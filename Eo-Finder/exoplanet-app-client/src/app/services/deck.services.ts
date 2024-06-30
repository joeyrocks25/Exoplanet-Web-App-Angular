// DeckService
// This service provides methods to interact with the server's API for managing decks.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private baseUrl = 'http://localhost:5000/api/v1.0/deck';

  constructor(private http: HttpClient) {}

  // Create deck method
  createDeck(deckName: string): Observable<any> {
    const createDeckUrl = `${this.baseUrl}`;
    const payload = { deck_name: deckName };

    return this.http.post(createDeckUrl, payload, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        console.log('New deck created successfully:', response);
      })
    );
  }

  // Get decks method
  getDecks(page: number, perPage: number): Observable<any> {
    const getDecksUrl = `http://localhost:5000/auth/v1.0/user?page=${page}&perPage=${perPage}`;

    return this.http.get(getDecksUrl, { headers: this.getHeaders() });
  }

  // Delete deck method
  deleteDeck(deckId: string): Observable<any> {
    const deleteDeckUrl = `${this.baseUrl}/${deckId}`;

    return this.http.delete(deleteDeckUrl, { headers: this.getHeaders() }).pipe(
      tap(() => {
        console.log(`Deck with ID ${deckId} deleted successfully.`);
      })
    );
  }

  // Get random questions for a deck method
  getDeckRandomQuestions(deckId: string): Observable<any> {
    const getQuestionsUrl = `${this.baseUrl}/random-question/${deckId}`;

    return this.http.get(getQuestionsUrl, { headers: this.getHeaders() });
  }

  // Get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
