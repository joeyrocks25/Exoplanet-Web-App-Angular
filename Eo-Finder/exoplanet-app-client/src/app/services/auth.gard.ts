// AuthGuard
// This guard implements CanActivate interface to control access to routes based on authentication.
// It checks if the user is authenticated using the AuthService and redirects to the login page if not.

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  // CanActivate method to determine if the route can be activated
  // It checks if the user is authenticated using the AuthService
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log('Token:', localStorage.getItem('access_token'));

    if (this.authService.isAuthenticated()) {
      console.log("Authentication successful. Allowing access.");
      return true;
    }
    
    console.log("Authentication failed. Redirecting to login.");
    this.router.navigate(['']); 
    return false;
  }
}
