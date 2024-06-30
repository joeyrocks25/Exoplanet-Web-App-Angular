// PlanetService
// This service provides methods for managing planets in a deck.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RefreshService } from './shared/refresh.service';

@Injectable({
  providedIn: 'root'
})
export class PlanetService {
  private baseUrl = 'http://localhost:5000/api/v1.0/deck';

  constructor(private http: HttpClient, private refreshService: RefreshService) {}

  // Method to add a planet to a deck
  addPlanetToDeck(deckId: string, exoplanet: any): Observable<any> {
    const addPlanetUrl = `${this.baseUrl}/${deckId}/planet`;
    const payload = {
      planet_name: exoplanet.planet_name,
      host_star: exoplanet.host_star,
      discovery_facility: exoplanet.discovery_facility,
      discovery_method: exoplanet.discovery_method,
      discovery_year: exoplanet.discovery_year,
      number_of_planets_in_system: exoplanet.number_of_planets_in_system,
      number_of_stars_in_system: exoplanet.number_of_stars_in_system,
      planetary_parameter_reference: exoplanet.planetary_parameter_reference,
      publication_date: exoplanet.publication_date,
      release_date: exoplanet.release_date,
      solar_system_type: exoplanet.solar_system_type,
      exoplanet_classification: exoplanet.exoplanet_classification,
    };

    return this.http.post(addPlanetUrl, payload, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        console.log(`Exoplanet added to deck successfully. Response:`, response);
      })
    );
  }

  // Method to get planets for a deck
  getPlanetsForDeck(deckId: string): Observable<any> {
    const getPlanetsUrl = `${this.baseUrl}/${deckId}`;

    return this.http.get(getPlanetsUrl, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        console.log('Planets fetched successfully:', response);
      })
    );
  }

  // Method to delete a planet from a deck
  deletePlanet(deckId: string, planetId: string): Observable<any> {
    const deletePlanetUrl = `${this.baseUrl}/${deckId}/planet/${planetId}`;

    return this.http.delete(deletePlanetUrl, { headers: this.getHeaders() }).pipe(
      tap(() => {
        console.log(`Planet with ID ${planetId} deleted successfully from deck with ID ${deckId}.`);
        this.refreshService.planetDeleted(planetId); 
      })
    );
  }

  // Private method to get request headers with the authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
