// CommentsService
// This service provides methods to interact with the server's API for managing comments on planets within a deck.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private baseUrl = 'http://localhost:5000/api/v1.0/deck';

  constructor(private http: HttpClient) {}

  // Add comments to a planet method
  addCommentsToPlanet(deckId: string, planetId: string, comments: string[]): Observable<any> {
    const addCommentsUrl = `${this.baseUrl}/${deckId}/planet/${planetId}/comments`;

    return this.http.post(addCommentsUrl, { comments }, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        console.log('Comments added to the planet successfully:', response);
      })
    );
  }

  // Get comments for a planet method
  getCommentsForPlanet(deckId: string, planetId: string): Observable<any> {
    const getCommentsUrl = `${this.baseUrl}/${deckId}/planet/${planetId}/comments`;

    return this.http.get(getCommentsUrl, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        console.log('Comments for the planet fetched successfully:', response);
      })
    );
  }

  // Update comment method
  updateComment(deckId: string, planetId: string, commentId: string, content: string): Observable<any> {
    const updateCommentUrl = `${this.baseUrl}/${deckId}/planet/${planetId}/comments/${commentId}`;

    return this.http.put(updateCommentUrl, { content }, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        console.log('Comment updated successfully:', response);
      })
    );
  }

  // Delete comment method
  deleteComment(deckId: string, planetId: string, commentId: string): Observable<any> {
    const deleteCommentUrl = `${this.baseUrl}/${deckId}/planet/${planetId}/comments/${commentId}`;

    return this.http.delete(deleteCommentUrl, { headers: this.getHeaders() }).pipe(
      tap(() => {
        console.log(`Comment with ID ${commentId} deleted successfully from planet with ID ${planetId}.`);
      })
    );
  }

  // Get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
