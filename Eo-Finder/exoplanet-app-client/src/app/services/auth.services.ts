// AuthService
// This service provides authentication-related functionalities, such as login, registration, logout, user details retrieval, and token management.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/auth/v1.0';

  constructor(private http: HttpClient) {}

  // Login method to authenticate the user
  login(payload: any): Observable<any> {
    const loginUrl = `${this.baseUrl}/login`;
    return this.http.post(loginUrl, payload, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        const token = response?.access_token;
        console.log('Received token during login:', token);
        if (token) {
          this.saveToken(token);
        }
      })
    );
  }

  // Register method to create a new user account
  register(payload: any): Observable<any> {
    const registerUrl = `${this.baseUrl}/register`;
    return this.http.post(registerUrl, payload, { headers: this.getHeaders() }).pipe(
      tap((response: any) => {
        const token = response?.access_token;
        console.log('Received token during registration:', token);
        if (token) {
          this.saveToken(token);
        }
      })
    );
  }

  // Logout method to end the user's session
  logout(): Observable<any> {
    const logoutUrl = `${this.baseUrl}/logout`;
    const headers = this.getHeaders();

    return this.http.post(logoutUrl, null, { headers }).pipe(
      tap(
        () => {
          this.clearToken();
          console.log('Logout successful.');
        },
        error => {
          console.error('Logout failed:', error);
        }
      )
    );
  }

  // Retrieve user details method
  getUserDetails(): Observable<any> {
    const userDetailsUrl = `${this.baseUrl}/user`;
    const headers = this.getHeaders();

    console.log('Request Headers for User Details:', headers);

    return this.http.get(userDetailsUrl, { headers }).pipe(
      tap(
        (response: any) => {
          console.log('Received user details:', response);
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      )
    );
  }

  // Update user details method
  updateUserDetails(data: any): Observable<any> {
    const updateDetailsUrl = `${this.baseUrl}/user/update`;

    return this.http.put(updateDetailsUrl, data, { headers: this.getHeaders() }).pipe(
      tap(() => {
        console.log('User details updated successfully.');
        console.log('Re-authenticating user with updated credentials.');
        this.login({ username: data.username, password: data.password }).subscribe(() => {
          console.log('User re-authenticated after details update.');
        });
      })
    );
  }


  // Delete current user method
  deleteCurrentUser(): Observable<any> {
    const deleteUrl = `${this.baseUrl}/user/delete`;
    const headers = this.getHeaders();

    console.log('Request Headers for Delete:', headers);

    return this.http.delete(deleteUrl, { headers }).pipe(
      tap(() => {
        console.log('User deletion request sent successfully.');
      }),
    );
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Clear token from local storage
  clearToken(): void {
    localStorage.removeItem('access_token');
    console.log('Token cleared from local storage.');
  }

  // Save token to local storage
  private saveToken(token: string): void {
    localStorage.setItem('access_token', token);
    console.log('Token saved to local storage:', token);
  }

  // Get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
