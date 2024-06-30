// ExoplanetService
// This service provides methods to interact with the server's API for managing exoplanets.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExoplanetService {
  private baseUrl = 'http://localhost:5000/collections/v1.0/exoplanets';

  constructor(private http: HttpClient) {}

  // Search exoplanets method
  searchExoplanets(searchValue: string): Observable<any> {
    const searchUrl = `${this.baseUrl}/search?search_value=${searchValue}`;

    return this.http.get(searchUrl).pipe(
      tap((response: any) => {
        console.log('Search results:', response);
      })
    );
  }

  // Get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
