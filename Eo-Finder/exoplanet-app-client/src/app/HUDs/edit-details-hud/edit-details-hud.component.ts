import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-details-hud',
  templateUrl: './edit-details-hud.component.html',
  styleUrls: ['./edit-details-hud.component.css']
})
export class EditDetailsHudComponent implements OnInit {
  userDetails: any;
  newPassword: string = '';
  newDetails: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUserDetails();
  } 

  // Function to load the user details and pre-fill the newDetails object
  loadUserDetails() {
    this.authService.getUserDetails().subscribe(
      (response) => {
        this.userDetails = response;
        this.newDetails = { ...response };
        console.log('User details:', response);
      },
      (error) => {
        console.error('Error loading user details:', error);
      }
    );
  }

  // Function to update the user details based on the changes in newDetails
  updateDetails() {
    if (Object.keys(this.newDetails).length > 0) {
      this.authService.updateUserDetails(this.newDetails).subscribe(
        () => {
          console.log('User details updated successfully.');
          this.loadUserDetails();
          this.openSnackBar('User details updated successfully', 'success');
        },
        (error) => {
          console.error('Error updating user details:', error);
          this.openSnackBar('Error updating user details', 'error');
        }
      );
    } else {
      console.warn('No new user details provided. Please update at least one field.');
    }
  }

  // Function to prompt the user for confirmation and delete the current user's account
  deleteUser() {
    if (confirm('Are you sure you want to delete your account?')) {
      this.authService.deleteCurrentUser().subscribe(
        () => {
          console.log('User deleted successfully.');
          this.router.navigate(['/']);
          this.openSnackBar('User deleted successfully', 'success');
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.openSnackBar('Error deleting user', 'error');
        }
      );
    }
  }

  // Function to open a snackbar with a message and an optional action
  openSnackBar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
